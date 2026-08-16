import React, { useEffect } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import serverUrl from '../config/config.js';

function Generate() {
  const navigate = useNavigate();
  const userData = useSelector(state => state.user.userData);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [error, setError] = useState("");
  const [generationsRemaining, setGenerationsRemaining] = useState(5);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const formatCooldown = (seconds) => {
    const safeSeconds = Math.max(0, Number(seconds) || 0);
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };
  
  // Initialize generations remaining from user data
  useEffect(() => {
    if (userData?.generationsToday !== undefined) {
      const remaining = Math.max(0, 5 - userData.generationsToday);
      setGenerationsRemaining(remaining);
    }
  }, [userData]);

  useEffect(() => {
    if (!userData?.lastGenerationTime) {
      setCooldownSeconds(0);
      return;
    }

    const updateCooldown = () => {
      const lastGenerationTime = new Date(userData.lastGenerationTime).getTime();
      const elapsedMs = Date.now() - lastGenerationTime;
      const remainingSeconds = Math.ceil((120000 - elapsedMs) / 1000);
      setCooldownSeconds(remainingSeconds > 0 ? remainingSeconds : 0);
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);
    return () => clearInterval(interval);
  }, [userData?.lastGenerationTime]);
  
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };
  
  const PHASES = [
        'Understanding the requirements',
        'analyzing update request',
        'Planning the structure',
        'Designing the layout',
        'Implementing the features',
        'Testing and debugging',
        'Finalizing the code'
    ]

  const handleGenerateWebsite = async () => {
    if (cooldownSeconds > 0 || loading) return;

    setLoading(true);
    setError("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/website/generate`,
        { prompt },
        {
          withCredentials: true,
          headers: getAuthHeaders(),
        }
      );
      // //console.log(result.data);
      setGenerationsRemaining(result.data.generationsRemaining || 5);
      setProgress(100);
      setLoading(false);
      navigate(`/editor/${result.data.websiteId}`);
    } catch (error) {
      console.log("Error generating website:", error);
      if (error.response?.status === 429 && error.response?.data?.remainingSeconds) {
        setCooldownSeconds(error.response.data.remainingSeconds);
      }
      setError(error.response?.data?.message || "An error occurred while generating the website.");
      setLoading(false);
    }
  } 

  useEffect(()=>{
    if(!loading){
      setProgress(0);
      setPhaseIndex(0);
      return;
    }
    let value = 0;
    let phase = 0;

    const interval = setInterval(()=>{
      const increment = 
            value<20
            ? Math.random() * 1.5
            : value < 60
            ? Math.random() * 1
            : value < 90
            ? Math.random() * 0.5
            : Math.random() * 0.2;
      value += increment;
      if(value >=93) value = 93;
      phase = Math.min(
        Math.floor((value / 100) * PHASES.length),
        PHASES.length - 1
      )
    setProgress(value);
    setPhaseIndex(phase);
  }, 1250);
  return () => clearInterval(interval);
}, [loading])

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

      <div className="max-w-4xl mx-auto px-6 py-6 relative z-10">
        
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
          className="max-w-3xl h-40 mx-auto"
        >
          <div className="relative group">
            {/* Outer glow for the text box */}
            <div className="absolute -inset-1 bg-gradient-to-r from-zinc-600 to-zinc-800 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-500"></div>

            <div className="relative bg-[#121212] rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden focus-within:border-white/30 transition-colors">
              <textarea
                required
                onChange={(e)=> setPrompt(e.target.value)}
                value={prompt}
                placeholder="Describe your website in detail... (e.g., A dark-themed portfolio for a designer)"
                className="w-full h-64 p-8 bg-transparent outline-none text-zinc-200 text-lg resize-none placeholder:text-zinc-600"
              ></textarea>
              
              {/* Bottom bar holding the button */}
              <div className="absolute bottom-0 left-0 w-full p-4 flex items-center justify-between bg-gradient-to-t from-[#121212] via-[#121212] to-transparent pt-12">
                <div className="text-xs text-zinc-500 font-medium px-4 hidden sm:flex flex-col gap-1">
                  <span>Be as detailed as possible</span>
                  <span className="text-blue-400">Generations remaining today: {generationsRemaining}/5</span>
                </div>
                
                {/* error display */}
                {error && (
                  <p className="text-red-500 text-sm max-w-sm">{error}</p>
                )}
                
                <motion.button
                  whileHover={{ scale: cooldownSeconds > 0 || loading || !prompt.trim() ? 1 : 1.02 }}
                  whileTap={{ scale: cooldownSeconds > 0 || loading || !prompt.trim() ? 1 : 0.98 }}
                  onClick={handleGenerateWebsite}
                  disabled={loading || !prompt.trim() || cooldownSeconds > 0}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold shadow-lg shadow-white/10 ml-auto ${
                    cooldownSeconds > 0 || loading || !prompt.trim()
                      ? "bg-white/30 text-white/50 cursor-not-allowed"
                      : "bg-white text-black hover:bg-white/90"
                  }`}
                >
                  <Sparkles size={18} />
                  {cooldownSeconds > 0 ? `Generate in ${formatCooldown(cooldownSeconds)}` : "Generate Website"}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* progress bar */}
        {loading && (
          <div className="max-w-sm mx-auto mt-30">
            <div className="flex justify-between text-sm text-zinc-400 mb-2">
              <span>Generating your website...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-zinc-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Generate;