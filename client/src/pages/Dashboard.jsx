import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const { userData } = useSelector(state => state.user)
  const navigate = useNavigate()

  return (
    <div className='min-h-screen bg-black text-white'>
      <div className='sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10'>
        <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <button className='text-white hover:text-zinc-300 transition-colors' onClick={() => navigate('/')}>
              <ArrowLeft size={20} />
            </button>
            <h1 className='text-xl font-bold'>Dashboard</h1>
          </div>
          <button className='px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-zinc-100 transition-colors' onClick={()=> navigate('/generate')}>
            + New Website
          </button>
        </div>
      </div>
      <div className='max-w-7xl mx-auto px-6 py-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className=''
        >
          <p className='text-sm text-zinc-400 mb-1'>Welcome back</p>
          <h1 className='text-3xl font-bold mb-8'>{userData?.name || 'Guest'}</h1>

          {/* Placeholder cards for websites */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div className='rounded-lg p-6 bg-white/5 border border-white/10 hover:border-white/20 transition-colors'>
              <h3 className='text-lg font-semibold mb-2'>Website 1</h3>
              <p className='text-zinc-400 text-sm mb-4'>Generated website description</p>
              <button className='bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors'>
                View
              </button>
            </div>
            <div className='rounded-lg p-6 bg-white/5 border border-white/10 hover:border-white/20 transition-colors'>
              <h3 className='text-lg font-semibold mb-2'>Website 2</h3>
              <p className='text-zinc-400 text-sm mb-4'>Another generated website</p>
              <button className='bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors'>
                View
              </button>
            </div>
            <div className='rounded-lg p-6 bg-white/5 border border-white/10 hover:border-white/20 transition-colors'>
              <h3 className='text-lg font-semibold mb-2'>Website 3</h3>
              <p className='text-zinc-400 text-sm mb-4'>Yet another website</p>
              <button className='bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors'>
                View
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard