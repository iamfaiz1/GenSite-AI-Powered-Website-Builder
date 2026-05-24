import axios from 'axios';
import React, { useEffect, useState , useRef} from 'react';
import { useParams } from 'react-router-dom';
import { serverUrl } from '../App';
import Header from '../components/Header';
import Chat from '../components/Chat';
import {Monitor, Code2, Rocket} from 'lucide-react'


function Editor() {
    const { id } = useParams();
    const [website, setWebsite] = useState(null);
    const [error, setError] = useState("");
    const iframeRef = useRef(null);
    const [code, setCode]=useState("")
    const [messages,setMessages]=useState([])
    const [prompt, setPrompt] = useState("")


    const getAuthHeaders = () => {
        const token = localStorage.getItem('authToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const handleUpdate = async ()=>{
        setMessages(prev => [...prev, {role:'user', content: prompt}]);
        try{
            const result = await axios.put(`${serverUrl}/api/website/update/${id}`,
                {prompt},
                {
                    withCredentials: true,
                    headers: getAuthHeaders(),
                }
            );
            setMessages(prev => [...prev, {role:'ai', content: result.data.message}]);
            setCode(result.data.code);
            
        }catch(error){
            console.error("Error updating website:", error.response?.data || error.message);
            setError(error.response?.data?.message || error.message || "An error occurred while updating.");
        }
    }

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/website/getById/${id}`, {
                    withCredentials: true,
                    headers: getAuthHeaders(),
                });
                setCode(result.data.latestCode);
                setMessages(Array.isArray(result.data.converstation) ? result.data.converstation : []);

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
                <Chat website={website} handleUpdate={handleUpdate} setPrompt={setPrompt} prompt={prompt} messages={messages} />
            </aside>


            {/* code Area (Website preview) */}
            <div className='flex-1 flex flex-col'>
                <div className='h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80'>
                    <span className='text-xs text-zinc-400'>Live Preview</span>
                    <div className='gap-2 flex'>
                        <button className='flex items-center gap-2 transiton hover: scale-105 text-sm font-semibold bg-linear-to-r from-indigo-500 to-purple-500 rounded-3xl px-2 py-1'><Rocket size={16} /> Deploy</button>
                        <button className='flex items-center gap-2'><Code2 size={18} /> </button>
                        <button className='flex items-center gap-2'><Monitor size={18} /> </button>
                    </div>
                </div>

                {/* iframe */}
                <iframe ref={iframeRef} className='flex-1 w-full bg-white'/>
            </div >
        </div >
    );
}

export default Editor;