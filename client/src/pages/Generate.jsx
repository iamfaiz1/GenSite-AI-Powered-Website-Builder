import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../App.jsx';

function Generate() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const handleGenerateWebsite = async ()=>{
    try{
      const result = await axios.post(`${serverUrl}/api/website/generate`, {prompt}, {withCredentials: true});
      console.log(result.data);
    }catch(error){
      console.log("Error generating website:", error);
    }
  } 

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Soft background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-zinc-700/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-zinc-800/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Glass Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-zinc-300 hover:text-white"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold tracking-tight">
              GenSite<span className="text-zinc-500 font-medium">.ai</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Build Websites with <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              Real AI Power
            </span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Tell us what you want to build. This process takes a moment, as we focus on high quality, not shortcuts.
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative group">
            {/* Outer glow for the text box */}
            <div className="absolute -inset-1 bg-gradient-to-r from-zinc-600 to-zinc-800 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-500"></div>

            <div className="relative bg-[#121212] rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden focus-within:border-white/30 transition-colors">
              <textarea
                onChange={(e)=> setPrompt(e.target.value)}
                value={prompt}
                placeholder="Describe your website in detail... (e.g., A dark-themed portfolio for a designer)"
                className="w-full h-64 p-8 bg-transparent outline-none text-zinc-200 text-lg resize-none placeholder:text-zinc-600"
              ></textarea>

              {/* Bottom bar holding the button */}
              <div className="absolute bottom-0 left-0 w-full p-4 flex items-center justify-between bg-gradient-to-t from-[#121212] via-[#121212] to-transparent pt-12">
                <span className="text-xs text-zinc-500 font-medium px-4 hidden sm:block">
                  Be as detailed as possible
                </span>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateWebsite}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold bg-white text-black shadow-lg shadow-white/10 hover:shadow-white/20 transition-all ml-auto"
                >
                  <Sparkles size={18} />
                  Generate Website
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}

export default Generate;