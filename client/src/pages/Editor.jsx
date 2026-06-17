import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import serverUrl from '../config/config.js';
import Header from '../components/Header';
import Chat from '../components/Chat';
import { Monitor, Code2, Rocket, MessageSquare } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Editor from '@monaco-editor/react';
import axiosInstance from '../utils/axiosInstance.js';


function WebsiteEditor() {
    const { id } = useParams();
    const [website, setWebsite] = useState(null);
    const [error, setError] = useState("");
    const iframeRef = useRef(null);
    const [code, setCode] = useState("")
    const [messages, setMessages] = useState([])
    const [prompt, setPrompt] = useState("")
    const [updateLoading, setUpdateLoading] = useState(false);
    const [thinkingIndex, setThinkingIndex] = useState(0);
    const [showCode, setShowCode] = useState(false);
    const [showFullPreview, setShowFullPreview] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const thinkingSteps = [
        'Understanding the requirements',
        'analyzing update request',
        'Planning the structure',
        'Designing the layout',
        'Implementing the features',
        'Testing and debugging',
        'Finalizing the code'
    ]



    const handleDeploy = async (id)=>{
    try{
      const result = await axiosInstance.get(`${serverUrl}/api/website/deploy/${website._id}`);
      window.open(result.data.url, '_blank'); //open deployed website
      
    }catch(error){
      //console.log("Deploy error (from dashboard):", error);
    }
    };


    const handleUpdate = async () => {
        if (!prompt) return;
        setUpdateLoading(true);

        const text = prompt;
        setPrompt("");

        setMessages(prev => [...prev, { role: 'user', content: prompt }]);
        try {
            const result = await axiosInstance.put(`${serverUrl}/api/website/update/${id}`,
                { prompt: text }
            );
            setMessages(prev => [...prev, { role: 'ai', content: result.data.message }]);
            setCode(result.data.code);
        } catch (error) {
            //console.error("Error updating website:", error.response?.data || error.message);
            setError(error.response?.data?.message || error.message || "An error occurred while updating.");
        } finally {
            setUpdateLoading(false);
        }
    };

    // Dyanamic Loading Text mechanism
    useEffect(() => {
        if (!updateLoading) return;

        const interval = setInterval(() => {
            setThinkingIndex(i => (i + 1) % thinkingSteps.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [updateLoading]);

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axiosInstance.get(`${serverUrl}/api/website/getById/${id}`);
                setCode(result.data.latestCode);
                setMessages(result.data.conversation ? result.data.conversation : []);


                if (!result?.data) {
                    setError(result?.data?.message || "No result found.");
                } else {
                    setWebsite(result.data);
                }
            } catch (error) {
                console.log("Error getting website:", error.response?.data || error.message);
                setError(error.response?.data?.message || error.message || "An error occurred.");
            }
        }
        handleGetWebsite();
    }, [id]);

    useEffect(() => {
        if (!code || !iframeRef.current) return;
        const blob = new Blob([code], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        iframeRef.current.src = url;
        return () => URL.revokeObjectURL(url);
    }, [code]);


    // Error State
    if (error) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-red-400 font-medium">
                <div className="bg-red-950/30 px-6 py-4 rounded-lg border border-red-500/20">
                    {error}
                </div>
            </div>
        );
    }

    // Loading State
    if (!website) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-zinc-400">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                </div>
            </div>
        );
    }

    // Main Layout
    return (
        <div className="flex h-screen w-screen bg-black text-white overflow-hidden">

            {/* Sidebar */}
            <aside className="hidden lg:flex w-[380px] flex-col border-r border-white/10 bg-black/80" >
                <Header website={website} />
                <Chat website={website} handleUpdate={handleUpdate} setPrompt={setPrompt} prompt={prompt} messages={messages} thinkingSteps={thinkingSteps} thinkingIndex={thinkingIndex} updateLoading={updateLoading} />
            </aside>


            {/* code Area (Website preview) */}
            <div className='flex-1 flex flex-col'>
                <div className='h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80'>
                    <span className='text-xs text-zinc-400'>Live Preview</span>
                    <div className='gap-2 flex'>
                        {/* HEADER BUTTONS */}
                        {website.deployed ? "":
                            <button
                                onClick={()=> handleDeploy(website._id)}
                                className='flex items-center gap-2 transiton hover: scale-105 text-sm font-semibold bg-linear-to-r from-indigo-500 to-purple-500 rounded-3xl px-2 py-1'
                            >
                                <Rocket size={16} /> Deploy </button>
                        }

                        <button
                            className='p-2 flex items-center gap-2 lg:hidden'
                            onClick={() => setShowChat(s => !s)}
                        >
                            <MessageSquare size={18} /> </button>


                        <button
                            className='flex items-center gap-2'
                            onClick={() => setShowCode(s => !s)}
                        >
                            <Code2 size={18} /> </button>


                        <button
                            className='flex items-center gap-2'
                            onClick={() => setShowFullPreview(true)}
                        >
                            <Monitor size={18} /> </button>
                    </div>
                </div>

                {/* iframe */}
                <iframe ref={iframeRef} className='flex-1 w-full bg-white' 
                sandbox='allow-scripts allow-same-origin, allow-forms '/>
            </div >

            {/* manual code editor */}
            <AnimatePresence>
                {showCode && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.15 }}
                        className='flex flex-col fixed top-0 inset-y-0 w-full right-0 z-[9999] left-0 h-full  bg-black/90 text-sm p-6 overflow-auto z-50'
                    >
                        <div className=' h-12 p-4 border-b border-white/10 flex items-center justify-between'>
                            <span className='text-sm font-medium'>index.html</span>
                            <button onClick={() => setShowCode(false)}> <X size={16} /> </button>
                        </div>
                        <Editor
                            theme='vs-dark'
                            value={code}
                            onChange={(value) => setCode(value)}
                            language='html'
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* chat for small device */}
            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.15 }}
                        className='flex flex-col fixed top-0 inset-y-0 w-full right-0 z-[9999] left-0 h-full  bg-black/90 text-sm p-6 overflow-auto z-50'
                    >
                        <Header website={website} onclose={() => setShowChat(false)} />
                        <Chat website={website} handleUpdate={handleUpdate} setPrompt={setPrompt} prompt={prompt} messages={messages} thinkingSteps={thinkingSteps} thinkingIndex={thinkingIndex} updateLoading={updateLoading} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* full preview mode */}
            <AnimatePresence>
                {showFullPreview && (
                    <motion.div className='flex flex-col fixed top-0 inset-y-0 w-full right-0 '>
                        <iframe className='h-full w-full bg-white' srcDoc={code} sandbox='allow-scripts allow-same-origin, allow-forms '/>
                        <button
                            className='absolute top-4 right-4 bg-black/50 rounded-xl p-2'
                            onClick={() => setShowFullPreview(false)}
                        ><X /> </button>
                    </motion.div>
                )}
            </AnimatePresence>

        </div >
    );
}

export default WebsiteEditor;