"use client";

import React, { useState } from 'react';
import { Zap, CheckCircle2, Shield, Lock, Server, Cpu, Send, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

// --- DIRECT SUPABASE CONNECTION (No errors) ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [selectedModel, setSelectedModel] = useState('Claude 4.6');
  const [selectedChannel, setSelectedChannel] = useState('Telegram');
  const [loading, setLoading] = useState(false);

  // --- SMART LOGIN (Bina Google Setup ke chalega) ---
  const handleLogin = async () => {
    setLoading(true);
    
    // User choices save
    localStorage.setItem('pendingModel', selectedModel);
    localStorage.setItem('pendingChannel', selectedChannel);

    // 1.5 Second ka fake loading user ko feel dene ke liye
    setTimeout(async () => {
        const email = `user-${Math.floor(Math.random() * 10000)}@clawlink.com`;
        const password = 'demo-password-secure';

        // Signup try
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        // Agar user pehle se hai, login karo
        if (data.user || (error && error.message.includes("already registered"))) {
            if (!data.user) {
                await supabase.auth.signInWithPassword({ email, password });
            }
            window.location.href = "/dashboard";
        } else {
             window.location.href = "/dashboard";
        }
    }, 1500);
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
            {/* ClawLink Logo (Black on White) */}
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
            <span className="text-slate-500">under 1 minute</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Avoid all technical complexity and one-click deploy your own 24/7 active OpenClaw instance using ClawLink Cloud.
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
              Which model do you want as default?
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['Claude Opus 4.5', 'GPT-5.2', 'Gemini 3 Flash'].map((model) => (
                <button 
                  key={model}
                  onClick={() => setSelectedModel(model)}
                  className={`relative flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                    selectedModel === model 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {model.includes('Claude') && <span className="text-orange-500">✴️</span>}
                  {model.includes('GPT') && <span className="text-green-500">⚡</span>}
                  {model.includes('Gemini') && <span className="text-blue-500">✨</span>}
                  {model}
                  {selectedModel === model && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-slate-900 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Channel Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-900 mb-4">
              Which channel do you want to use for sending messages?
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
              
              <div className="relative group opacity-60 cursor-not-allowed">
                 <button disabled className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-100 bg-slate-50 text-slate-400 text-sm font-medium">
                    Discord
                 </button>
                 <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-medium whitespace-nowrap">Coming soon</span>
              </div>

              <div className="relative group opacity-60 cursor-not-allowed">
                 <button disabled className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-100 bg-slate-50 text-slate-400 text-sm font-medium">
                    WhatsApp
                 </button>
                 <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-medium whitespace-nowrap">Coming soon</span>
              </div>
            </div>
          </div>

          {/* 3. GOOGLE LOGIN BUTTON */}
          <button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-white border border-slate-300 text-slate-700 h-12 rounded-lg font-semibold text-base flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-[0.99]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                 <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
                 Connecting to Google...
              </span>
            ) : (
              <>
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                Sign in with Google
              </>
            )}
          </button>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">
              Sign in to deploy your AI assistant. <span className="text-blue-600 font-medium">Limited cloud servers — only 11 left</span>
            </p>
          </div>
        </motion.div>
      </section>

      {/* --- COMPARISON TABLE (BRANDED CLAWLINK) --- */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-slate-900">Traditional Method vs ClawLink</h2>
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
                    <div className="mt-6 flex justify-between items-center font-bold text-lg text-slate-900 border-t border-slate-300 pt-4">
                        <span>Total</span>
                        <span>~60 min</span>
                    </div>
                    <p className="text-xs text-red-500 mt-2 italic">
                        *If you're non-technical, multiply this by 10.
                    </p>
                </div>

                {/* ClawLink Side */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-black"></div>
                    <h3 className="font-bold text-slate-900 mb-2 text-xl">ClawLink Cloud</h3>
                    <div className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">
                        &lt;1 min
                    </div>
                    <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                        Pick a model, connect Telegram, deploy — done under 1 minute.
                        Servers, SSH, and OpenClaw Environment are already set up.
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                            <CheckCircle2 className="w-4 h-4 text-green-600" /> Instant Setup
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                            <CheckCircle2 className="w-4 h-4 text-green-600" /> Secure Connection
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                            <CheckCircle2 className="w-4 h-4 text-green-600" /> No Maintenance
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </section>

    </div>
  );
}