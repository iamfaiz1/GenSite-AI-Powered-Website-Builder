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
      <div className='sticky top-0 z-50 dashboard-header'>
        <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <button className='text-white hover:text-gray-300' onClick={() => navigate('/')}>
              <ArrowLeft size={20} />
            </button>
            <h1 className='text-xl font-bold'>Dashboard</h1>
          </div>
          <button className='text-white hover:text-gray-300 font-semibold hover:scale-105 transition' onClick={()=> navigate('/generate')}>
            + New Website
          </button>
        </div>
      </div>
      <div className='max-w-7xl mx-auto px-6 py-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        >
          <p className='text-sm text-zinc-400 mb-1'>Welcome back</p>
          <h1 className='text-3xl font-bold'>{userData?.name || 'Guest'}</h1>

          {/* Placeholder cards for websites */}
          <div className='dashboard-card rounded-lg p-6'>
            <h3 className='text-lg font-semibold mb-2'>Website 1</h3>
            <p className='text-gray-400 text-sm mb-4'>Generated website description</p>
            <button className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors'>
              View
            </button>
          </div>
          <div className='dashboard-card rounded-lg p-6'>
            <h3 className='text-lg font-semibold mb-2'>Website 2</h3>
            <p className='text-gray-400 text-sm mb-4'>Another generated website</p>
            <button className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors'>
              View
            </button>
          </div>
          <div className='dashboard-card rounded-lg p-6'>
            <h3 className='text-lg font-semibold mb-2'>Website 3</h3>
            <p className='text-gray-400 text-sm mb-4'>Yet another website</p>
            <button className='bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors'>
              View
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard