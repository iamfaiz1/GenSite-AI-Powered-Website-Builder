import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'


function Generate() {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen bg-linear-to-br from-[#1a1a1a] to-[#070202] text-white'>
      <div className='sticky top-0 z-50 dashboard-header'>
        <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <button className='text-white hover:text-gray-300' onClick={() => navigate('/')}>
              <ArrowLeft size={20} />
            </button>
            <h1 className='text-xl font-bold'>GenSite<span className='text-zinc-400 '>.ai</span></h1>
          </div>
          
        </div>
      </div>
      <div className=' max-w-6xl mx-auto px-6 py-16'>
        <motion.div
          initial={{opacity: 0, y:30}}
          animate={{opacity: 1, y:0}}
          className='text-center mb-16'
        >
          <h1 className='text-4xl md: text-5xl font-bold mb-5 leading-tight'>Build Websites with 
            <span className='bold bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent '> real AI Power</span>
          </h1>
          <p className=' text-zinc-400 max-w-2xl mx-auto'>
            This process may take several minutes. GenSite focuses on quality not shortcuts.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Generate