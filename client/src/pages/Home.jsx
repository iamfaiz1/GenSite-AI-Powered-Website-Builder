import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoginModel from '../components/LoginModel'
import { useSelector } from 'react-redux'
import { Coins, Trash } from 'lucide-react'
import axiosInstance from '../utils/axiosInstance'
import { setUserData } from '../redux/userSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Pricing from './Pricing'




function Home() {
    const highlights = [
        {
            title: "AI Generated Code",
            description: "Leverage advanced AI to generate clean, efficient, and modern code tailored to your specifications, accelerating your development workflow."
        },
        {
            title: "Fully Responsive Design",
            description: "Ensure your website looks perfect on any device, from desktops to mobile phones, with automatically generated responsive layouts."
        },
        {
            title: "Production-Ready Output",
            description: "Receive high-quality, optimized code that's ready for deployment, meeting industry standards and best practices."
        },
        {
            title: "Customizable Templates",
            description: "Start with a diverse library of professionally designed templates and easily customize them to match your brand and vision."
        }
    ]
    const [openLogin, setOpenLogin] = useState(false)
    const [openProfile, setOpenProfile] = useState(false)
    const [publicWebsites, setPublicWebsites] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { userData } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await axiosInstance.post('/api/auth/logout');
            localStorage.removeItem('authToken');
            dispatch(setUserData(null));
            setOpenProfile(false);
        } catch (error) {
            //console.error("Error occurred while logging out:", error);
            setError(error.response?.data?.message || "An error occurred while logging out.");
        }
    }

    const handleGetPublicWebsites = async () => {
        setLoading(true);
        try {
            const result = await axiosInstance.get('/api/website/public');
            // console.log("Public websites fetched:", result.data);
            setPublicWebsites(result.data || []);
            setLoading(false);
        } catch (error) {
            //console.error('Error fetching websites (getAllWebsites error):', error);
            setError(error.response?.data?.message || "An error occurred while fetching websites.");
            setLoading(false);
        }
    };
    useEffect(() => {
        handleGetPublicWebsites();
    }, []);


    return (
        <div className='relative min-h-screen bg-black text-white overflow-hidden'>

            {/* Navbar */}
            <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className='fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10'
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className='text-lg font-semibold'>
                        GenSite.ai
                    </div>
                    <div className='flex items-center gap-5'>
                        {/* <div className='hidden md:flex items-center gap-2 text-sm text-zinc-400'>
                            <span className='text-zinc-400'>Public</span>
                            <span className='font-semibold text-white'>{publicWebsites.length}</span>
                        </div> */}
                        <div
                            onClick={() => navigate('/pricing')}
                            className='hidden md:inline text-sm text-zinc-400 hover:text-white cursor-pointer'>
                            Pricing
                        </div>
                        {userData &&
                            <div
                                onClick={() => navigate('/pricing')}
                                className='hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm cursor-pointer hover:bg-white/10  transition'>
                                <Coins className='text-yellow-400' />
                                <span className='text-zinc-300'>Credits</span>
                                <span>{userData.credits}</span>
                                <span className='font-semibold'>+</span>
                            </div>
                        }
                        {userData &&
                            <div
                                onClick={() => navigate('/trash')}
                                className=' hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm cursor-pointer hover:bg-white/10  transition'>
                                <Trash className='text-red-400 ' size={18} />
                                <span className='text-zinc-300 ' >Trash</span>

                            </div>
                        }


                        {!userData ? <button className='px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-sm'
                            onClick={() => setOpenLogin(true)}
                        >
                            Get Started
                        </button> :
                            <div className='relative'>
                                <button className='flex items-center' onClick={() => setOpenProfile(!openProfile)}>
                                    <img src={userData?.avatar || `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(userData?.name || 'User')}`} alt="user" referrerPolicy='no-referrer' className='w-9 h-9 rounded-full border border-white/20 object-cover' />
                                </button>

                                <AnimatePresence>
                                    {openProfile && (
                                        <>
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className='absolute right-0 mt-3 w-60 z-50 bg-black/85 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl text-sm overflow-hidden'
                                            >
                                                <div className='px-4 py-3 border-b border-white/10'>
                                                    <p className='truncate text-xs font-medium'>{userData.name}</p>
                                                    <p className='truncate text-xs text-zinc-500 font-medium'>{userData.email}</p>
                                                    <button className='md:hidden w-full px-4 py-3 flex items-center gap-2 mt-2 rounded-lg bg-white/5 border border-white/10 text-sm cursor-pointer hover:bg-white/10  transition'>
                                                        <Coins className='text-yellow-400' />
                                                        <span className='text-zinc-300'>Credits</span>
                                                        <span>{userData.credits}</span>
                                                        <span className='font-semibold'>+</span>
                                                    </button>

                                                    <button className='w-full px-4 pt-3 text-left text-sm hover:bg-white/10' onClick={() => navigate('/dashboard')}>Dashboard</button>
                                                    <button onClick={handleLogout} className='w-full px-4 pt-2 font-semibold text-left text-sm hover:bg-white/5 text-red-500'>Logout</button>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>

                            </div>
                        }
                    </div>
                </div>
            </motion.div>

            {/* Hero Section */}
            <section className='pt-44 pb-32 px-6 text-center'>
                <div className='max-w-4xl mx-auto'>

                    <motion.h1
                        className="text-5xl md:text-7xl font-bold tracking-tight"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        Build Stunning Websites <br />
                        <span className='bg-linear-to-r from-green-400 to-violet-600 bg-clip-text text-transparent'>
                            with AI
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className='mt-8 max-w-2xl mx-auto text-zinc-400 text-lg'
                    >
                        Transform ideas into stunning responsive websites in seconds. No coding, just creativity.
                    </motion.p>

                    <button

                        onClick={() => !userData ? setOpenLogin(true) : navigate('/dashboard')}
                        className='mt-12 px-10 py-3 rounded-lg bg-white border text-black text-lg font-semibold transition duration-300 hover:scale-105 hover:bg-gray-100' >
                        {!userData ? "Get Started" : "Go to Dashboard"}
                    </button>

                </div>
            </section>

            {/* Cards Section */}
            <section className='max-w-7xl mx-auto px-6 pb-20 mt-16'>

                <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
                    {highlights.map((h, i) => (
                        <motion.div
                            key={h.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-lg hover:bg-white/10 transition"
                        >
                            <h1 className='text-lg font-semibold mb-2'>{h.title}</h1>

                            <p className='text-sm text-zinc-400 leading-relaxed'>
                                {h.description}
                            </p>
                        </motion.div>
                    ))}

                </div>

            </section>


            {/* Fetch Public websites from all users */}
            {/* Public Websites */}
            <section className="max-w-7xl mx-auto px-6 pb-24 mt-16">

                <div className="mb-10 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold">
                            Explore Public Websites
                        </h2>
                        <p className="mt-2 text-sm text-zinc-400">
                            Websites created by the GenSite community
                        </p>
                    </div>

                    <div className="ml-auto flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300">
                        <span className="text-zinc-400">Public Websites:</span>
                        <span className="text-sm font-semibold text-white">{publicWebsites.length}</span>
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center py-20">
                        <p className="text-zinc-400">Loading websites...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center py-20">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                {!loading && !error && publicWebsites.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-zinc-500">
                            No public websites available yet.
                        </p>
                    </div>
                )}

                {!loading && !error && publicWebsites.length > 0 && (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">

                        <AnimatePresence>
                            {publicWebsites.map((site, i) => (

                                <motion.div
                                    key={site._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: i * 0.05,
                                        duration: 0.35
                                    }}
                                    whileHover={{ y: -6 }}
                                    className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-2xl transition-colors hover:border-white/20 hover:bg-white/[0.05]"
                                >

                                    {/* Website Preview */}
                                    <div
                                        className="relative h-56 w-full bg-zinc-900 overflow-hidden cursor-pointer"
                                        onClick={() => {
                                            if (site.deployUrl) {
                                                window.open(site.deployUrl, "_blank");
                                            } else if (site.slug) {
                                                window.open(`${window.location.origin}/site/${site.slug}`, "_blank");
                                            }
                                        }}
                                    >

                                        <div className="pointer-events-none absolute inset-0 h-[400%] w-[400%] origin-top-left scale-25">

                                            <iframe
                                                width="100%"
                                                height="100%"
                                                srcDoc={site.latestCode}
                                                title={site.title || "Public Website"}
                                                frameBorder="0"
                                                className="h-full w-full bg-white"
                                            />

                                        </div>

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100">

                                            <div className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-xl">
                                                View Website
                                            </div>

                                        </div>

                                    </div>

                                    {/* Website Info */}
                                    <div className="border-t border-white/10 px-4 pb-4 pt-3">

                                        <h3 className="line-clamp-2 text-base font-semibold">
                                            {site.title || "Untitled Website"}
                                        </h3>

                                        <div className='flex items-center gap-3 mt-2'>
                                            <img src={site.user?.avatar || `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(site.user?.name || 'User')}`} alt={site.user?.name || 'Creator'} referrerPolicy='no-referrer' className='w-8 h-8 rounded-full border border-white/10 object-cover' />
                                            <div>
                                                <p className='text-sm font-medium'>{site.user?.name || 'Unknown'}</p>
                                                <p className='text-xs text-zinc-400'>
                                                    Created {new Date(site.createdAt).toLocaleDateString(undefined, {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric"
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Open Website Button */}
                                        <motion.button
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                if (site.deployUrl) {
                                                    window.open(site.deployUrl, "_blank");
                                                } else if (site.slug) {
                                                    window.open(`${window.location.origin}/site/${site.slug}`, "_blank");
                                                }
                                            }}
                                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-3xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold transition hover:scale-[1.02] hover:bg-white/20"
                                        >
                                            Visit Website
                                        </motion.button>

                                    </div>

                                </motion.div>

                            ))}
                        </AnimatePresence>

                    </div>
                )}

            </section>


            {/* footer */}
            <footer className='border-t border-white/10 py-14 text-center text-sm text-zinc-500'>
                &copy; {new Date().getFullYear()} GenSite.ai. All rights reserved.
            </footer>

            {/* Login Model rendering*/}
            {openLogin && <LoginModel open={openLogin} onClose={setOpenLogin} />}


        </div>
    )
}

export default Home