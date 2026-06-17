import React from 'react'
import { ArrowLeft, Check, Coins } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, } from 'framer-motion'
import RazorpayCheckout from '../components/RazorpayCheckout.jsx'


const plans = [
  {
    key: "trial",
    name: "Trial",
    price: "₹5",
    credits: 5,
    description: "Perfect to explore GenWeb.ai",
    features: [
      "AI website generation",
      "Responsive HTML output",
      "Basic animations",
      "Community support",
    ],
    popular: false,
    button: "Get Started",
  },
  {
    key: "basic",
    name: "Basic",
    price: "₹19",
    credits: 25,
    description: "For serious creators & freelancers",
    features: [
      "25 AI credits",
      "Advanced website generation",
      "Premium templates",
      "Custom animations",
      "Priority support",
      "Export source code",
    ],
    popular: true,
    button: "Try Basic",
  },
  {
    key: "pro",
    name: "Pro",
    price: "₹49",
    credits: 75,
    description: "Best for agencies and teams",
    features: [
      "75 AI credits",
      "Unlimited projects",
      "Team collaboration",
      "White-label exports",
      "Priority generation queue",
      "Dedicated support",
    ],
    popular: false,
    button: "You're Pro",
  },
  {
    key: "legend",
    name: "Legend",
    price: "₹99",
    credits: 165,
    description: "For the most ambitious projects",
    features: [
      "165 AI credits",
      "Unlimited projects",
      "Team collaboration",
      "White-label exports",
      "Priority generation queue",
      "Dedicated support",
    ],
    popular: false,
    button: "Be Legend",
  }
];


function Pricing() {
  const navigate = useNavigate()


  return (
    <div className = 'min-h-screen overflow-hidden bg-zinc-900 text-white pt-16 pb-24 px-6 relative'>
      <div className = 'absolute inset-0 pointer-events-none'>
        <div className = 'absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]'/>
        <div className = 'absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px]'/>
      </div>

      <button className = 'relative-z mb-6 flex items-center gap-2 text-sm text-zinc-50 bg-zinc-800 hover:text-white transition' 
      onClick={() => navigate(-1)}
      >
        <ArrowLeft size={24} />
          Back
      </button>
    
    <motion.div
    initial = {{ opacity: 0, y: 24 }}
    animate = {{ opacity: 1, y: 0 }}
    className = 'relative z-10 max-w-4xl mx-auto text-center mb-14'
    >
      <h1 className='text-4xl font-bold mb-4 md:text-5xl'> Simple, Transparent Pricing </h1>
      <p className='mt-4 text-zinc-400 text-lg'> Choose a plan that works for you.</p>
    </motion.div>

    <div className = 'relative z-10 max-w-7xl mx-auto grid md:grid-cols-3 gap-8'>
      {plans.map((p, i) => (
        <motion.div
        key={p.key}
        initial = {{ opacity: 0, y: 40 }}
        whileInView = {{ opacity: 1, y: 0 }}
        transition = {{ delay: i * 0.12 }}
        whileHover = {{ scale: 1.005 }}
        className = {`relative rounded-3xl p-8 border backdrop-blur-xl transition-all
          ${p.popular ? 
            "border-2 border-indigo-500 bg-gradient-to-b from-indigo-500/20 to-transparent shadow-2xl shadow-indigo-500/40" :
            " border-white/10 bg-white/5 hover:border-indigo-400 hover:bg-white/10"
            }`}
        >
          {p.popular &&(
            <span className = 'absolute top-5 right-5 px-3 py-1 text-xs bg-indigo-500 text-white rounded-full'
            >Most Popular</span>
          )}
          <h1 className= 'text-xl font-semibold mb-2'>{p.name}</h1>
          <p className= ' text-zinc-400 text-sm mb-4'>{p.description}</p>

          {/* price */}
          <div className = 'flex items-end gap-1 mb-4'>
            <span className='text-4xl font-bold'>{p.price}</span>
            <span className= 'text-sm text-zinc-400 mb-1    '>/one-time</span>
          </div>

          <div className='flex items-center gap-2 mb-8'>
            <Coins size={24} className='text-yellow-400' />
            <span className='text-sm font-bold text-zinc-400'>{p.credits} AI Credits </span>
          </div>
          <ul>
            {p.features.map((f, i) => (
              <li key={i} className = 'flex items-center gap-2 text-sm mb-2 text-zinc-300'>
                
                <Check className='text-green-400' size={16}/> {f}
              </li>
            ))}
          </ul>

          <RazorpayCheckout plan={p} />
        </motion.div>
      ))}
    </div>

    </div>
  )
}

export default Pricing