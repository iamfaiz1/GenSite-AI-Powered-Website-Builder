import generateResponse from "../APIs/generateResponse.js";
import Website from "../models/website.model.js";
import User from "../models/user.model.js";
import extractJson from "../utils/extractJson.js";
import path from "path";
import htmlWebsitePrompt from "../prompts/htmlWebsitePrompt.js";

const masterPrompt = htmlWebsitePrompt;
// console.log(masterPrompt);


export const generateWebsite = async (req, res) => {
  try {
    const { prompt } = req.body
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" })
    }
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    // Credits
    if (user.credits < 5) {
      return res.status(400).json({ message: "You dont have enough credits. Please buy more credits." })
    }

    // Rate Limiting - Check 2 minute cooldown
    const now = new Date();
    if (user.lastGenerationTime) {
      const timeDiffInMinutes = (now - user.lastGenerationTime) / (1000 * 60);
      if (timeDiffInMinutes < 2) {
        const remainingSeconds = Math.ceil((2 - timeDiffInMinutes) * 60);
        return res.status(429).json({ 
          message: `You can generate a website every 2 minutes. Please wait ${remainingSeconds} seconds.`,
          remainingSeconds
        })
      }
    }

    // Rate Limiting - Check daily limit (5 websites per day)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const lastReset = user.lastResetDate ? new Date(user.lastResetDate) : null;
    
    // Reset counter if it's a new day
    if (!lastReset || lastReset < todayStart) {
      user.generationsToday = 0;
      user.lastResetDate = now;
    }

    if (user.generationsToday >= 5) {
      const tomorrow = new Date(todayStart);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const hoursUntilReset = Math.ceil((tomorrow - now) / (1000 * 60 * 60));
      return res.status(429).json({ 
        message: `You have reached your daily limit of 5 websites. Try again tomorrow.`,
        generationsToday: user.generationsToday,
        hoursUntilReset
      })
    }

    const finalPrompt = masterPrompt.replace('USER_PROMPT', prompt)

    let raw = ""
    let parsed = null
    for (let i = 0; i < 2 && !parsed; i++) {
      raw = await generateResponse(finalPrompt);
      parsed = await extractJson(raw);

      if (!parsed) {
        raw = await generateResponse(finalPrompt + "\n\nRETURN ONLY RAW JSON.");
        parsed = await extractJson(raw);
      }
    }
    if (!parsed.code) {
      // //console.log("ai returned invalid response", raw)
      return res.status(400).json({ message: "AI returned invalid response" })
    }

    // Generate a unique slug
    const slug = `${prompt.slice(0, 30).toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    const website = await Website.create({
      user: user._id,
      title: prompt.slice(0, 50),
      slug: slug,
      latestCode: parsed.code,
      conversation: [
        {
          role: 'user',
          content: prompt,
        },
        {
          role: 'ai',
          content: parsed.message,
        }
      ]

    })
    user.credits -= 5;
    user.lastGenerationTime = new Date();
    user.generationsToday += 1;
    await user.save();
    return res.status(200).json({
      websiteId: website._id,
      remainingCredits: user.credits,
      generationsToday: user.generationsToday,
      generationsRemaining: 5 - user.generationsToday,

    })

  } catch (error) {
    return res.status(500).json({ message: `GenerateWebsite Error: ${error}` })
  }
}


export const getWebsiteById = async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id
    })
    if (!website) {
      return res.status(400).json({ message: "Website not found" })
    }
    return res.status(200).json(website)
  } catch (error) {
    return res.status(500).json({ message: `GetWebsiteById Error: ${error}` })
  }
}


// changes to existing website
export const changes = async (req, res) => {
  try {
    const { prompt } = req.body
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" })
    }
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id
    })
    if (!website) {
      return res.status(400).json({ message: "Website not found" })
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    // Credits
    if (user.credits < 2) {
      return res.status(400).json({ message: "You dont have enough credits. Please buy more credits." })
    }

    const updatePrompt = `
    UPDATE THIS HTML WEBSITE.

    CURRENT CODE:
    ${website.latestCode}

    USER REQUEST:
    ${prompt}

    RETURN RAW JSON ONLY:
    {
      "message": "Short confirmation",
      "code": "<UPDATED FULL HTML DOCUMENT>"
    }
    `
    let raw = ""
    let parsed = null
    for (let i = 0; i < 2 && !parsed; i++) {
      raw = await generateResponse(updatePrompt);
      parsed = await extractJson(raw);

      if (!parsed) {
        raw = await generateResponse(updatePrompt + "\n\nRETURN ONLY RAW JSON.");
        parsed = await extractJson(raw);
      }
    }
    if (!parsed.code) {
      // console.log("ai returned invalid response", raw)
      return res.status(400).json({ message: "AI returned invalid response" })
    }

    website.conversation.push(
      { role: 'user', content: prompt },
      { role: 'ai', content: parsed.message }
    )
    website.latestCode = parsed.code;
    await website.save();
    user.credits -= 2;
    await user.save();
    return res.status(200).json({
      message: parsed.message,
      code: parsed.code,
      remainingCredits: user.credits,

    })

  } catch (error) {
    return res.status(500).json({ message: `Change website Error: ${error}` })
  }
}

export const getAll = async (req, res) => {
  try {
    const websites = await Website.find({ 
      user: req.user._id,
      deleted: false
     })
    return res.status(200).json(websites)
  } catch (error) {
    return res.status(500).json({ message: `Get All Websites Error: ${error}` })
  }
}


export const deploy = async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id
    })
    if (!website) {
      return res.status(400).json({ message: "Website not found" })
    }
    if (!website.slug) {
      website.slug = website.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60) + website._id.toString().slice(-5);
    }

    website.deployed = true;
    website.deployUrl = `${process.env.FRONTEND_URL}/site/${website.slug}`
    await website.save();
    return res.status(200).json({
      url: website.deployUrl
    })
  } catch (error) {
    return res.status(500).json({ message: `Deploy Website Error: ${error}` })
  }
}


export const getWebsiteBySlug = async (req, res) => {
  try {
    const website = await Website.findOne({
      slug: req.params.slug
    })
    if (!website) {
      return res.status(400).json({ message: "Website not found" })
    }

    if (website.isPublic) {
      return res.status(200).json(website)
    }

    // allow owner (authenticated) to access their private site
    if (req.user && website.user && website.user._id.toString() === req.user._id.toString()) {
      return res.status(200).json(website)
    }

    return res.status(401).json({ message: "Unauthorized to access this website" })
  } catch (error) {
    return res.status(500).json({ message: `GetWebsiteBySlug Error: ${error}` })
  }
}


// is website publically available?
export const makePublic = async (req, res) => {
  try {
    const website = await Website.findOneAndUpdate({
      _id: req.params.id,
      user: req.user._id
    },
      {
        isPublic: true
      }
    );

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    return res.status(200).json({
      message: "Website made public successfully"
    })

  } catch (error) {
    return res.status(500).json({ message: `IsPublic Error: ${error}` });
  }
}
export const makePrivate = async (req, res) => {
  try {
    const website = await Website.findOneAndUpdate({
      _id: req.params.id,
      user: req.user._id
    },
      {
        isPublic: false
      }
    );

    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }

    return res.status(200).json({
      message: "Website made Private successfully"
    })

  } catch (error) {
    return res.status(500).json({ message: `isPrivate Error: ${error}` });
  }
}


// move to website Trash
export const moveToTrash = async (req, res) => {
  try {
    const website = await Website.findOneAndUpdate({
      _id: req.params.id,
      user: req.user._id
    },
      {
        deleted: true
      }
    );

    if (!website) {
      return res.status(404).json({ message: "Website not found to move to bin" })
    }

    if (website?.deleted) return res.status(400).json({ message: "Website already in bin" })

    return res.status(204).json({ message: "Website moved to Website bin successfully" })

  } catch (error) {
    // console.log(error.message);
    return res.status(500).json({ message: `TempDelete Error: ${error}` });
  }
}

// restore from website Trash
export const websiteRestore = async (req, res) => {
  try {
    const website = await Website.findOneAndUpdate({
      _id: req.params.id,
      user: req.user._id
    },
      {
        deleted: false
      }
    );

    if (!website) {
      return res.status(404).json({ message: "Website not found to move to bin" })
    }
    if (!website?.deleted) return res.status(400).json({ message: "Website not Found in bin, Did You already restored it or Permanently Deleted it?" });

    return res.status(204).json({ message: "Website restored successfully" })

  } catch (error) {
    // console.log(error.message);
    return res.status(500).json({ message: `Website Restore Error: ${error}` });
  }
}


// permament delete
export const deleteWebsiteById = async (req, res) => {
  try {
    const website = await Website.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!website) {
      return res.status(404).json({ message: "Website not found" })
    }
    return res.status(204).json({ message: "Website deleted successfully" })
  } catch (error) {
    return res.status(500).json({ message: `DeleteWebsiteById Error: ${error}` })
  }
}

export const getAllInTrash = async (req, res) => {
  try {
    const websites = await Website.find({
      user: req.user._id,
      deleted: true
    })
    return res.status(200).json(websites)
  } catch (error) {
    return res.status(500).json({ message: `Get All Websites Error: ${error}` })
  }
}

export const permanentDeleteAll = async(req, res)=> {
  try{
    const websites = await Website.deleteMany({
      deleted: true,
      user: req.user._id
    })
    return res.status(200).json(websites);
  }catch(error){
    return res.status(500).json({ message: `Permanent Delete All Error: ${error}` })
  }
}


// fetch public website by slug without authentication
export const getPublicWebsites = async (req, res) => {
  try{
    const websites = await Website.find({ isPublic: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    if (!websites || websites.length === 0) {
      return res.status(404).json({ message: "Currently there're no public Websites available." })
    }

    return res.status(200).json(websites);

  }catch(error){
    return res.status(500).json({ message: `Get Public Website By Slug Error: ${error}` })
  }
};