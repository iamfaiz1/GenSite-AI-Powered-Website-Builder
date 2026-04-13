import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from '../firebase';
import { useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';

import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';


function LoginModel({ open, onClose }) {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const handleGoogleLogin = async (e) => {
        e.stopPropagation();
        if (isLoading) return;
        try {
            setIsLoading(true);
            const result = await signInWithPopup(auth, provider);
            const {data} = await axios.post(`${serverUrl}/api/auth/google`, {
                name:result.user.displayName,
                email:result.user.email,
                avatar:result.user.photoURL

            },{withCredentials:true});
            dispatch(setUserData(data));

            onClose(false); // Only close the modal on success

        } catch (error) {
            console.error("Error signing in with Google:", error);
            
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className='fixed inset-0 z- flex items-center justify-center bg-black/70 backdrop-blur-md px-4'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => onClose(false)}
                >
                    <motion.div
                        initial={{ scale: 0.92, opacity: 0, y: 15 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.92, opacity: 0, y: 15 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className='w-full max-w-95'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='relative overflow-hidden rounded-xl w-full max-w-95 bg-[#0f0f0f] border border-white/10 shadow-2xl p-7'>

                            {/* Subtle Background Glows */}
                            <div className="absolute -top-20 -left-20 w-48 h-48 bg-purple-500/15 blur-[80px] pointer-events-none" />
                            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-blue-500/15 blur-[80px] pointer-events-none" />

                            {/* Close Button */}
                            <button
                                className='absolute top-5 right-5 z-20 text-zinc-500 hover:text-white transition-colors'
                                onClick={() => onClose(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>

                            <div className='relative z-10 flex flex-col items-center text-center'>
                                <span className='px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-purple-400 bg-purple-400/10 rounded-full mb-5'>
                                    AI Builder
                                </span>

                                <h2 className='text-2xl font-bold tracking-tight text-white mb-2'>
                                    Welcome to <span className='bg-linear-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text'>GenSite.ai</span>
                                </h2>

                                <p className='text-zinc-400 text-xs mb-8'>
                                    Sign in to start creating your site.
                                </p>

                                {/* Fine-tuned Google Button */}
                                <motion.button
                                    whileHover={{ scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className='w-full max-w-70 flex items-center justify-center gap-3 px-5 py-2.5 rounded-xl border border-white/10 text-white text-sm font-medium transition-all bg-white/5'
                                    onClick={handleGoogleLogin}
                                >
                                    <img
                                        src="/src/assets/google.svg"
                                        alt=""
                                        className="w-4 h-4"
                                        onError={(e) => { e.target.src = "https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" }}
                                    />
                                    <span>Continue with Google</span>
                                </motion.button>

                                <div className='mt-8 pt-6 border-t border-white/5 w-full'>
                                    <p className='text-[10px] text-zinc-600 '>
                                        Secure Login &bull; by clicking "Continue with Google", you agree to our <a href="#" className='text-purple-400 hover:underline'>Terms of Service</a> and <a href="#" className='text-purple-400 hover:underline'>Privacy Policy</a>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default LoginModel;