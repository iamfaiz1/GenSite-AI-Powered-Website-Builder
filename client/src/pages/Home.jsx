import React from 'react'
import { motion } from 'framer-motion'

function Home() {
    const highlights = [
        "AI Generated Code",
        "Fully Responsive Design",
        "Production ready Output",
        "Customizable Templates"
    ]

    return (
        <div className='relative min-h-screen bg-black text-white overflow-hidden'>
            
            <motion.div 
            initial={{y:-40, opacity:0}}
            animate={{y:0, opacity:1}}
            transition={{duration:0.5, delay:0.2}}
            className='fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40
            border-b border-white/10'
            >
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                <div className='text-lg font-semibold'>
                    GenSite.ai 
                </div>
                <div className='flex items-center gap-5'>
                    <div className='hidden md:inline text-sm text-zinc-400 hover:text-white cursor-pointer'>
                       Pricing  
                    </div>
                    <button className='px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-sm'>
                        Get Started
                    </button>

                </div>

            </div>
            </motion.div>

            <section className='pt-44 pb-32 px-6 text-center'>

                <motion.h1 className= "text-5xl md:text-7xl font-bold tracking-tight"
                initial={{opacity:0, y:40}}
                animate={{opacity:1, y:0}}
                transition={{duration:0.5, delay:0.4}}
                >
                    Build Stunning Websites <br />
                    <span className='bg-linear-to-r from-green-500 to-violet-900 bg-clip-text text-transparent'>with AI</span>
                
                </motion.h1>

                <motion.p 
                initial={{opacity:0, y:-40}}
                animate={{opacity:1, y:0}}
                transition={{duration:0.5, delay:0.4}}

                className='mt-8 max-w-2xl mx-auto text-zinc-400 text-lg'
                >
                Transform ideas into stunning responsive websites in seconds. No coding, just creativity.
                </motion.p>

                <button className='mt-12 px-10 py-3 rounded-lg bg-white border text-black text-lg font-semibold transition-colors duration-300
                hover:scale-102'>
                    Get started
                </button>


                {/* Cards */}
                <section className='max-w-7xl mx-auto px-6 pb-32'>
                    <div>
                       {highlights.map((h, i)=>(
                        <motion.div
                            key = {i}
                            initial = {{opacity:0, y:40}}
                            whileInView = {{opacity:1, y:0}}
                            transition={{duration:0.5, delay:0.4}}
                            >  

                            <h1 className='text-xl font-semibold mb-3'>{h}</h1>
                            <p className='text-sm text-zinc-400'>
                                Effortlessly transform your ideas into professional, responsive websites in seconds using our intuitive AI-powered platform.
                            </p>
                        </motion.div>
                    ))} 
                    </div>

                </section>
            </section>

        </div>
    )
}

export default Home