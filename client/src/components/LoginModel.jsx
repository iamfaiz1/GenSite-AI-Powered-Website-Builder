import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function LoginModel({open, onClose}) {
  return (
    <>
    <AnimatePresence>
    {open &&
    <motion.div
    className='fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl px-4 '
    initial={{opacity:0}}
    animate={{opacity:1}}
    exit={{opacity:0}}
    transition={{duration:0.5}}
    onClick={()=>onClose(false)}
    > 
        <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className='p-8 w-full max-w-md rounded-3xl'
            onClick={(e) => e.stopPropagation()}
        >
            <div className='relative rounded-3xl bg-[#0b0b0b] border border-white/10 shadow-lg overflow-hidden p-6'>
                <motion.div
                    animate={{ opacity: [0.25, 0.4, 0.25] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-32 -left-32 w-80 h-80 bg-purple-500/30 blur-[140px] z-0"
                />
                <motion.div
                    animate={{ opacity: [0.2, 0.35, 0.2] }}
                    transition={{ duration: 6, repeat: Infinity, delay: 2, ease: "easeInOut" }}
                    className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-500/25 blur-[140px] z-0"
                />
                <button className='absolute top-5 right-5 z-20 text-zinc-400 hover:text-white transition text-lg' onClick={() => onClose(false)}>
                    x
                </button>
                <div className='relative px-8 pt-14 pb-10 text-center'>
                    <h1 className='inline-block text-2xl font-bold text-white mb-4'>AI-Powered website builder</h1>
                    <h2 className='text-3xl font-semibold leading-tight mb-3 spae-x-2'>
                       <span>Welcome to </span> 
                       <span className='bg-linear-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text'>GenSite.ai </span> 
                    </h2>

                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='mt-8 px-6 py-3 rounded-lg border text-white text-lg font-semibold transition duration-300 flex items-center gap-3 mx-auto overflow-hidden'
                    >
div/
                        <div className='relative flex items-center justify-center gap-3'>
                            <img src=".\src\assets\google.svg.svg" alt="google logo" />
                            Continue with Google
                        </div>
                        
                    </motion.button>
                </div>
            </div>
        </motion.div>
    </motion.div>
    }

    </AnimatePresence>
    </>
  )
}

export default LoginModel