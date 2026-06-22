import React from 'react'
import { ArrowLeft, Trash, Globe, Lock, Rocket, ArrowRight, Share2, Check  } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosInstance'
import serverUrl from '../config/config.js';
import { useState, useEffect } from 'react'




function Dashboard() {
  const { userData } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copyId, setCopyId] = useState("");

  const handleDeploy = async (id) => {
    try {
      const result = await axiosInstance.get(`${serverUrl}/api/website/deploy/${id}`);
      window.open(result.data.url, '_blank'); //open deployed website
      setWebsites(
        (prev) => prev.map(w => w._id === id
          ? { ...w, deployed: true, deployUrl: result.data.url }
          : w
        )
      );
    } catch (error) {
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
  const handleCopy = async (site) => {
    await navigator.clipboard.writeText(site.deployUrl);
    setCopyId(site._id);
    setTimeout(() => {
      setCopyId("");
    }, 3500);
  }

  // making public or private
  const handleMakePublic = async (id) => {
    try {
      await axiosInstance.patch(`${serverUrl}/api/website/make/${id}/public`);
      setWebsites(
        (prev) => prev.map(w => w._id === id && !w.public && window.confirm("Are you sure you want to make this website public?")
          ? { ...w, public: true }
          : w
        )
      );
    } catch (error) {
      //console.log("Deploy error (from dashboard):", error);
      setError(error.response?.data?.message || "An error occurred while fetching websites in HandlePublic.");
    }
  }
  const handleMakePrivate = async (id) => {
    try {
      await axiosInstance.patch(`${serverUrl}/api/website/make/${id}/private`);
      setWebsites(
        (prev) => prev.map(w => w._id === id && w.public
          ? { ...w, public: false }
          : w
        )
      );
    } catch (error) {
      //console.log("Deploy error (from dashboard):", error);
      setError(error.response?.data?.message || "An error occurred while fetching websites in HandlePublic.");
    }
  }


  // delete website function
  const handleTempDelete = async (id) => {
    const websitesBeforeDeletion = websites;

    setWebsites(prev =>
      prev.filter(w => w._id !== id)
    );

    try {
      if (!window.confirm("Are you sure you want to delete this website?")) {
        setWebsites(websitesBeforeDeletion); // restore 
        return;
      }
      await axiosInstance.patch(`${serverUrl}/api/website/make/${id}/delete`);
    } catch (error) {
      setWebsites(websitesBeforeDeletion); // restore 
    }
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
            <AnimatePresence>
              {websites.map((w, i) => {
                const copied = copyId === w._id;
                return (
                  <motion.div
                    key={w._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      scale: 0.4,
                      rotate: 12,
                      filter: "blur(12px)"
                    }}
                    transition={{
                      delay: i * 0.05,
                      duration: 0.35
                    }}
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
                    <div className=" items-center justify-between border-t border-white/10 pt-2 pb-4 px-4">
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

                      {/* buttons container starts */}
                      <div className="flex items-center justify-between gap-2">
                        {/* deploy button on cards */}
                        {!w.deployed ? (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            className='mt-4 flex w-full justify-center items-center gap-2 transition hover:scale-105 text-sm font-semibold bg-linear-to-r from-indigo-500 to-purple-500 rounded-3xl px-0 py-2'
                            onClick={() => handleDeploy(w._id)}
                          >
                            <Rocket size={18} /> Deploy
                          </motion.button>
                        ) :
                          // copy button if already deployed
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCopy(w)}
                            className={`mt-4 flex w-full justify-center items-center gap-2 transition hover:scale-105 text-sm font-semibold rounded-3xl px-0 py-2
                      ${copied
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-white/10 hover:bg-white/20 border border-white/10'}
                      `}
                          >
                            {copied ?
                              <>
                                Copied! <Check size={18} />
                              </>
                              :
                              <>
                                Copy Link <Share2 size={18} />
                              </>
                            }
                          </motion.button>
                        }

                        {/* delete button */}
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleTempDelete(w._id)}
                          className="mt-2 flex w-full justify-center items-center gap-2 transition hover:scale-105 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-3xl px-0 py-2 border border-red-700"
                        >
                          Delete <Trash size={18} />
                        </motion.button>

                        {/* Public and private button */}
                        {w.public ? (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            className='mt-2 flex w-full justify-center items-center gap-2 transition hover:scale-105 text-sm font-semibold bg-white/10 hover:bg-white/20 rounded-3xl px-0 py-2 border border-white/10'
                            onClick={() => handleMakePrivate(w._id)}
                          >
                            <Lock size={18} /> Make Private
                          </motion.button>
                        ) :
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleMakePublic(w._id)}
                            className='mt-2 flex w-full justify-center items-center gap-2 transition hover:scale-105 text-sm font-semibold bg-emerald-600 text-white rounded-3xl px-0 py-2 border border-emerald-500/30'
                          >
                            <Globe size={18} /> Make Public
                          </motion.button>
                        }
                      {/* buttons container end  */}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}

        {/* end */}
      </div>
    </div>
  )
}



export default Dashboard