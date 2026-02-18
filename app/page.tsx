"use client";

import React, { useState, useEffect } from 'react';
import { Zap, CheckCircle2, Shield, Lock, Server, Cpu, Send, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

// --- DIRECT SUPABASE CONNECTION (Fixed for Red Line Errors) ---
// Humne "|| ''" lagaya hai taki agar key load na ho to bhi app crash na kare
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Home() {
  const [selectedModel, setSelectedModel] = useState('Claude 4.6');
  const [selectedChannel, setSelectedChannel] = useState('Telegram');
  const [loading, setLoading] = useState(false);

  // --- RAZORPAY SCRIPT LOAD ---
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // --- PAYMENT & LOGIN HANDLE ---
  const handlePaymentAndLogin = async () => {
    setLoading(true);
    
    // User choices save karna
    localStorage.setItem('pendingModel', selectedModel);
    localStorage.setItem('pendingChannel', selectedChannel);

    // 1. Fake User Login (Demo account create karna)
    const email = `user-${Math.floor(Math.random() * 10000)}@clawlink.com`;
    const password = 'demo-password-secure';
    
    // Supabase mein user register karna
    const { data, error } = await supabase.auth.signUp({ email, password });
    
    // Agar user pehle se hai, to sign in karlo
    if (!data.user && error && error.message.includes("already registered")) {
        await supabase.auth.signInWithPassword({ email, password });
    }

    // 2. Razorpay Payment Trigger
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_HERE", // Vercel se key lega
      amount: 49900, // ₹499.00
      currency: "INR",
      name: "ClawLink Premium",
      description: "Unlock Claude 4.6 Agent",
      handler: function (response: any) {
        // Payment Success hone par Dashboard bhejo
        // alert(`Payment ID: ${response.razorpay_payment_id}`); // Optional Alert
        window.location.href = "/dashboard";
      },
      prefill: {
        name: "ClawUser",
        email: email,
        contact: "9999999999"
      },
      theme: {
        color: "#0f172a"
      }
    };

    // @ts-ignore  <-- Ye line Red Error rokne ke liye zaroori hai
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
    
    // Loading stop tabhi hoga jab payment popup band ho ya complete ho
    // rzp1.on('payment.failed', function (response: any){ setLoading(false); });
    setLoading(false); 
  };

  // Comparison Data
  const traditionalSteps = [
    { task: "Purchasing local virtual machine", time: "15 min" },
    { task: "Creating SSH keys and storing securely", time: "10 min" },
    { task: "Installing Node.js and NPM", time: "5 min" },
    { task: "Installing OpenClaw", time: "7 min" },
    { task: "Connecting to AI provider", time: "4 min" },
  ];

  return (
    // ✨ WHITE THEME
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-slate-200">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* ClawLink Logo */}
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-black/20">
              C
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              ClawLink
            </span>
          </div>
          <div className="flex items-center gap-4">
             <a href="#" className="text-sm font-medium text-slate-500 hover:text-black transition">Documentation</a>
             <a href="#" className="text-sm font-medium text-slate-500 hover:text-black transition">Pricing</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 flex flex-col items-center z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900 leading-tight">
            Deploy OpenClaw <br />
            <span className="text-slate-500">starts at ₹499</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Avoid all technical complexity. One-click deploy your own 24/7 active AI Agent with simple payment.
          </p>
        </div>

        {/* --- MAIN INTERFACE CARD --- */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-[600px] bg-white border border-slate-200 rounded-2xl p-8 shadow-2xl shadow-slate-200/50"
        >
          
          {/* 1. Model Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-900 mb-4">
              Which model do you want?
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['Claude 4.6', 'GPT-5.2', 'Gemini 3 Flash'].map((model) => (
                <button 
                  key={model}
                  onClick={() => setSelectedModel(model)}
                  className={`relative flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                    selectedModel === model 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Channel Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-900 mb-4">
              Select Channel
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => setSelectedChannel('Telegram')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                  selectedChannel === 'Telegram' 
                  ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                  : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <Send className="w-4 h-4" /> Telegram
              </button>
              
              <button disabled className="bg-slate-50 border-slate-100 text-slate-400 p-3 rounded-lg text-sm cursor-not-allowed">Discord</button>
              <button disabled className="bg-slate-50 border-slate-100 text-slate-400 p-3 rounded-lg text-sm cursor-not-allowed">WhatsApp</button>
            </div>
          </div>

          {/* 3. PAYMENT & DEPLOY BUTTON */}
          <button 
            onClick={handlePaymentAndLogin}
            disabled={loading}
            className="w-full bg-black text-white h-12 rounded-lg font-bold text-base flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-[0.99]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                 Processing...
              </span>
            ) : (
              <>
                Pay ₹499 & Deploy
              </>
            )}
          </button>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">
              Secured by Razorpay • <span className="text-blue-600 font-medium">Money back guarantee</span>
            </p>
          </div>
        </motion.div>
      </section>

      {/* --- COMPARISON TABLE --- */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-slate-900">Traditional vs ClawLink</h2>
          </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
                
                {/* Traditional Side */}
                <div>
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <span className="text-slate-400 italic">Traditional</span>
                    </h3>
                    <div className="space-y-4">
                        {traditionalSteps.map((step, i) => (
                           <div key={i} className="flex justify-between text-sm border-b border-slate-200 pb-2">
                              <span className="text-slate-600">{step.task}</span>
                              <span className="font-mono text-slate-500">{step.time}</span>
                           </div> 
                        ))}
                    </div>
                </div>

                {/* ClawLink Side */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-black"></div>
                    <h3 className="font-bold text-slate-900 mb-2 text-xl">ClawLink Cloud</h3>
                    <div className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">
                        &lt;1 min
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                            <CheckCircle2 className="w-4 h-4 text-green-600" /> Instant Setup
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                            <CheckCircle2 className="w-4 h-4 text-green-600" /> Secure Connection
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </section>

    </div>
  );
}