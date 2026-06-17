import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import serverUrl from '../config/config.js';
import { useState, useEffect } from 'react'
import { Rocket, ArrowRight, Share2, Check } from 'lucide-react'



function Dashboard() {
  const { userData } = useSelector(state => state.user)
  const navigate = useNavigate()
  const [websites, setWebsites] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copyId, setCopyId] = useState("")

  const handleDeploy = async (id)=>{
    try{
      const result = await axiosInstance.get(`${serverUrl}/api/website/deploy/${id}`);
      window.open(result.data.url, '_blank'); //open deployed website
      setWebsites(
        (prev) => prev.map(w => w._id ===id
        ? {...w, deployed: true, deployUrl: result.data.url}
        : w
        )
      );
    }catch(error){
      //console.log("Deploy error (from dashboard):", error);
    }
  }


  useEffect(() => {
    const handleGetAllWebsites = async () => {
      setLoading(true);
      try {
        const result = await axiosInstance.get(`${serverUrl}/api/website/getAll`);
        setWebsites(result.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching websites (getAllWebsites error):', error);
        setError(error.response?.data?.message || "An error occurred while fetching websites.");
        setLoading(false);
      }
    }
    handleGetAllWebsites();
  }, [])

  // copy deployed url feature function
  const handleCopy  = async (site)=>{
    await navigator.clipboard.writeText(site.deployUrl);
    setCopyId(site._id);
    setTimeout(() => {
      setCopyId("");
    }, 3500);
  }

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
          <button className='px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-zinc-100 transition-colors' onClick={() => navigate('/generate')}>
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

        </motion.div>

        {/* loading and error */}
        {loading &&
          <div className='mt-24 text-center text-zinc-400'> Loading your websites...</div>
        }
        {error && !loading &&
          <div className='mt-24 text-center text-red-500'> {error} </div>
        }
        {websites.length === 0 && !loading && !error &&
          <div className='mt-24 text-center text-zinc-400'> You have no websites yet. Click "New Website" to get started! </div>
        }


        {/* displaying created websites */}
        {websites.length > 0 && !loading && !error && (
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {websites.map((w, i) => {
              const copied = copyId === w._id;
              return (
                <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{ y: -6 }}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-2xl transition-colors hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div 
                onClick={() => navigate(`/editor/${w._id}`)} 
                className="relative h-56 w-full bg-zinc-900 overflow-hidden">
                  <div className="pointer-events-none absolute inset-0 h-[400%] w-[400%] origin-top-left scale-25">
                    <iframe
                      width="100%"
                      height="100%"
                      srcDoc={w.latestCode}
                      title={w.name}
                      frameBorder="0"
                      className="h-full w-full bg-white"
                    ></iframe>
                  </div>

                  {/* glass hover effect */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100">

                  </div>
                </div>

                {/* Bottom Section: Clean Text Footer */}
                <div className=" items-center justify-between border-t border-white/10 p-5">
                  <h1 className="text-base line-clamp-2 font-semibold">
                    {w.title || 'Untitled Website'}
                  </h1>
                  <p className="mt-0 text-xs py-2 text-zinc-400">
                    Last Updated {""}
                    {new Date(w.updatedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  {/* deploy button on cards*/}
                  {/* deploy button on cards */}
                  {!w.deployed ? (
                    <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className='mt-auto flex w-full justify-center items-center gap-2 transition hover:scale-105 text-sm font-semibold bg-linear-to-r from-indigo-500 to-purple-500 rounded-3xl px-0 py-2'
                    onClick={() => handleDeploy(w._id)}
                    >
                      <Rocket size={18} /> Deploy
                    </motion.button>
                  ):
                  // copy button if already deployed
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCopy(w)}
                    className={`mt-auto flex w-full justify-center items-center gap-2 transition hover:scale-105 text-sm font-semibold bg-linear-to-r 
                    rounded-3xl px-0 py-2
                    
                    ${copied 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-white/10 hover:bg-white/20 bg-white/20 border border-white/10'}
                    `}
                    >
                      {copied ?
                        <> 
                          Copied! <Check size={18} /> 
                        </>
                        :
                        <> 
                          Copy Link to Share
                          <Share2 size={18}/>
                        </>
                      }
                    </motion.button>
                  }
                </div>
              </motion.div>
              )
            })}
          </div>
        )}

        {/* end */}
      </div>
    </div>
  )
}

export default Dashboard