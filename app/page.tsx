"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Send, Zap, MessageSquare, Disc, Activity, 
  Mail, Calendar, DollarSign, ShoppingCart, 
  Briefcase, Users, Rocket, LogOut, X, Layers, Mic, ShieldCheck, Sparkles, Check, Server, AlertTriangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SUPABASE DIRECT CONNECTION (NO IMPORT ERRORS) ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- GLOBAL DECLARATION ---
declare global {
  interface Window {
    Razorpay: any;
  }
}

// --- DATA ARRAYS ---
const capabilities = [
  { icon: <Mail size={20}/>, title: "Email Management", desc: "Summarize, draft replies, and organize your inbox automatically." },
  { icon: <Calendar size={20}/>, title: "Scheduling", desc: "Meeting reminders, weekly planning, and time zone syncing." },
  { icon: <Briefcase size={20}/>, title: "Business Tools", desc: "Generate invoices, contracts, NDAs, and competitor research." },
  { icon: <DollarSign size={20}/>, title: "Finance", desc: "Track expenses, receipts, payroll, and insurance comparisons." },
  { icon: <ShoppingCart size={20}/>, title: "Shopping & Deals", desc: "Find coupons, price-drop alerts, and product comparisons." },
  { icon: <Users size={20}/>, title: "Team Productivity", desc: "Generate standup summaries, OKR tracking, and job descriptions." },
  { icon: <MessageSquare size={20}/>, title: "Customer Support", desc: "Automate ticket replies, routing, and instant assistance." }
];

const roadmapFeatures = [
  { icon: <MessageSquare size={20}/>, title: "Expanded Channels", desc: "WhatsApp integration (currently in progress)." },
  { icon: <Zap size={20}/>, title: "More AI Models", desc: "Continuous updates with newer versions (Claude Opus 4.6, Gemini Pro)." },
  { icon: <Layers size={20}/>, title: "Workflow Automation", desc: "Daily briefings, customer support assistants, and team ops automation." },
  { icon: <Server size={20}/>, title: "Scalability", desc: "Expansion planned beyond current limited cloud servers." }
];

const limitations = [
  { icon: <AlertTriangle size={20}/>, title: "Limited Servers", desc: "Only a small number of cloud instances available at a time." },
  { icon: <MessageSquare size={20}/>, title: "Channel Support", desc: "WhatsApp and other integrations are not yet live." },
  { icon: <ShieldCheck size={20}/>, title: "Cloud Dependency", desc: "Requires trust in ClawLink's hosted infrastructure." },
  { icon: <Activity size={20}/>, title: "Early-Stage Project", desc: "Features may evolve quickly, so stability could vary." }
];

const traditionalSteps = [
  { step: "Purchasing local virtual machine", time: "15 min" },
  { step: "Creating SSH keys and storing securely", time: "10 min" },
  { step: "Connecting to the server via SSH", time: "5 min" },
  { step: "Installing Node.js and NPM", time: "5 min" },
  { step: "Installing OpenClaw", time: "7 min" },
  { step: "Setting up OpenClaw", time: "10 min" },
  { step: "Connecting to AI provider", time: "4 min" },
  { step: "Pairing with Telegram", time: "4 min" }
];

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [selectedModel, setSelectedModel] = useState('Claude Opus');
  const [selectedChannel, setSelectedChannel] = useState('Telegram');
  const [loading, setLoading] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  // --- RAZORPAY SCRIPT LOADER ---
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // --- REAL GOOGLE LOGIN HANDLER ---
  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/dashboard` 
        }
      });
      if (error) throw error;
    } catch (error: any) {
      alert("Login Failed: " + error.message);
      setLoading(false);
    }
  };

  // --- REAL RAZORPAY PAYMENT HANDLER ---
  const handlePayment = (amount: number, plan: string) => {
    if (!window.Razorpay) {
      alert("Payment gateway is loading. Please try again in a few seconds.");
      return;
    }
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_key",
      amount: amount * 100,
      currency: "INR",
      name: `ClawLink ${plan}`,
      description: "Cloud Deployment Allocation",
      handler: () => { 
        setShowPricing(false);
        setDeploying(true);
        setTimeout(() => window.location.href="/dashboard", 2000); 
      },
      prefill: { email: userEmail },
      theme: { color: "#06141B" }
    };
    new window.Razorpay(options).open();
  };

  return (
    <div className="min-h-screen bg-[#06141B] text-[#CCD0CF] font-sans selection:bg-[#4A5C6A]">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#06141B]/90 backdrop-blur-xl border-b border-[#253745]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-white tracking-tight">
             <div className="w-8 h-8 bg-[#CCD0CF] rounded-md flex items-center justify-center text-[#06141B]">
                <Zap size={18} fill="currentColor"/>
             </div>
             ClawLink
          </div>
          <div className="hidden md:flex gap-8 text-xs font-semibold text-[#9BA8AB]">
              <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
              <a href="#roadmap" className="hover:text-white transition-colors">Roadmap</a>
              <a href="#comparison" className="hover:text-white transition-colors">Comparison</a>
          </div>
        </div>
      </nav>

      {/* 1. HERO & DEPLOYMENT WIZARD */}
      <section className="relative pt-36 pb-24 px-4 flex flex-col items-center">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Deploy OpenClaw under 1 minute
          </h1>
          <p className="text-[#9BA8AB] max-w-2xl mx-auto text-lg leading-relaxed">
            No technical setup required — servers, SSH, Node.js, and environment are pre-configured.
          </p>
        </motion.div>

        <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="w-full max-w-[700px] bg-[#11212D] border border-[#253745] rounded-2xl p-8 md:p-10 shadow-2xl relative">
            
            {/* Model Selection */}
            <div className="mb-10">
                <label className="text-base font-bold text-white mb-4 block">Which model do you want as default?</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      {id: 'Claude Opus', icon: <Zap size={16} fill="currentColor"/>, color: '#D97757'},
                      {id: 'GPT-5.2', icon: <Zap size={16}/>, color: '#CCD0CF'},
                      {id: 'Gemini 3', icon: <Sparkles size={16} fill="currentColor"/>, color: '#3B82F6'}
                    ].map((m) => (
                        <button key={m.id} onClick={() => setSelectedModel(m.id)} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${selectedModel === m.id ? 'bg-[#253745] border-[#9BA8AB] text-white shadow-lg' : 'bg-transparent border-[#253745] text-[#9BA8AB] hover:border-[#4A5C6A]'}`}>
                            <div className="flex items-center justify-center" style={{color: m.color}}>{m.icon}</div>
                            <span className="text-sm font-semibold">{m.id}</span>
                            {selectedModel === m.id && <Check size={16} className="ml-auto text-[#CCD0CF]"/>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Channel Selection */}
            <div className="mb-10">
                <label className="text-base font-bold text-white mb-4 block">Which channel do you want to use for sending messages?</label>
                <div className="grid grid-cols-3 gap-3">
                    <button onClick={() => setSelectedChannel('Telegram')} className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border transition-all ${selectedChannel === 'Telegram' ? 'bg-[#253745] border-[#9BA8AB] text-white shadow-lg' : 'bg-transparent border-[#253745] text-[#9BA8AB]'}`}>
                        <div className="text-[#229ED9]"><Send size={16} className="ml-0.5 mt-0.5" fill="currentColor"/></div>
                        <span className="text-sm font-semibold">Telegram</span>
                    </button>
                    <button onClick={() => setSelectedChannel('Discord')} className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border transition-all ${selectedChannel === 'Discord' ? 'bg-[#253745] border-[#9BA8AB] text-white shadow-lg' : 'bg-transparent border-[#253745] text-[#9BA8AB]'}`}>
                        <div className="text-[#5865F2]"><Disc size={16} className="ml-0.5 mt-0.5" fill="currentColor"/></div>
                        <span className="text-sm font-semibold">Discord</span>
                    </button>
                    <div className="relative opacity-40 cursor-not-allowed">
                        <button disabled className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border border-[#253745] bg-transparent text-[#4A5C6A] text-sm font-medium">
                            <MessageSquare size={16}/> WhatsApp
                        </button>
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-[#4A5C6A] font-medium">Coming soon</span>
                    </div>
                </div>
            </div>

            {/* Action Area */}
            <div className="pt-6">
                {!isLoggedIn ? (
                    <button onClick={handleLogin} disabled={loading} className="w-full md:w-auto px-8 bg-white text-[#06141B] h-12 rounded-lg font-bold flex items-center justify-center gap-3 hover:bg-[#CCD0CF] transition-all">
                        {loading ? <Activity className="animate-spin" size={18}/> : <><img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google"/> Sign in for quick setup</>}
                    </button>
                ) : (
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between p-4 bg-[#06141B] rounded-xl border border-[#253745]">
                            <div className="flex items-center gap-4">
                                <img src={`https://ui-avatars.com/api/?name=User&background=253745&color=fff`} alt="User" className="w-10 h-10 rounded-full" />
                                <div>
                                    <div className="text-sm font-bold text-white flex items-center gap-2">Connected Account <LogOut size={12} className="text-[#4A5C6A] cursor-pointer hover:text-white" onClick={() => setIsLoggedIn(false)}/></div>
                                    <div className="text-xs text-[#9BA8AB]">Ready to deploy</div>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setShowPricing(true)} disabled={deploying} className="w-full md:w-1/2 bg-[#253745] text-white border border-[#4A5C6A] h-12 rounded-lg font-bold text-sm flex items-center justify-center gap-3 hover:bg-[#4A5C6A] transition-all shadow-xl">
                            {deploying ? <Rocket className="animate-bounce" size={18}/> : <Zap size={16} fill="currentColor"/>}
                            {deploying ? "Deploying Server..." : "Deploy OpenClaw"}
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-8 pt-6 text-sm text-[#9BA8AB] border-t border-[#253745]">
                Connect Telegram or Discord to continue. <span className="text-[#4A5C6A] font-semibold">Limited cloud servers — only a small number available.</span>
            </div>
        </motion.div>
      </section>

      {/* 2. PRICING MODAL (Connected to Razorpay) */}
      <AnimatePresence>
        {showPricing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#06141B]/90 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#11212D] text-[#CCD0CF] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl relative shadow-2xl border border-[#253745]">
              <button onClick={() => setShowPricing(false)} className="absolute top-4 right-4 p-2 hover:bg-[#253745] rounded-full text-[#9BA8AB]"><X/></button>
              
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-white">📊 ClawLink Subscription Plans</h2>
                
                <div className="overflow-x-auto border rounded-xl border-[#253745]">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-[#253745] text-white">
                      <tr>
                        <th className="p-4 font-bold">Feature</th>
                        <th className="p-4 font-bold">Free ($0)</th>
                        <th className="p-4 font-bold">Pro ($5.99)</th>
                        <th className="p-4 font-bold bg-[#4A5C6A]/20">Unlimited</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#253745]">
                      {[
                        {f: 'Cloud Server', v1: 'Shared', v2: 'Dedicated', v3: 'Dedicated'},
                        {f: 'Memory Storage', v1: 'Limited', v2: '20 GB', v3: 'Unlimited'},
                        {f: 'AI Credits', v1: '100', v2: '500', v3: '1,000+'},
                        {f: 'Uptime', v1: 'Standard', v2: '24/7 Sandbox', v3: '24/7 Priority'},
                        {f: 'Channels', v1: '1 Channel', v2: 'All Channels', v3: 'All Channels'}
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-[#253745]/30 transition-colors">
                          <td className="p-4 font-medium text-[#CCD0CF]">{row.f}</td>
                          <td className="p-4 text-blue-400 font-bold">{row.v1}</td>
                          <td className="p-4 text-blue-400 font-bold">{row.v2}</td>
                          <td className="p-4 text-blue-400 font-bold bg-[#4A5C6A]/10">{row.v3}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <button onClick={() => handlePayment(0, "Free")} className="p-4 rounded-xl border-2 border-[#253745] font-bold hover:bg-[#253745] text-white transition-all">Get Started Free</button>
                  <button onClick={() => handlePayment(499, "Pro")} className="p-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg transition-all">Deploy Pro</button>
                  <button onClick={() => handlePayment(999, "Unlimited")} className="p-4 rounded-xl bg-[#CCD0CF] text-[#06141B] font-bold hover:bg-white shadow-lg transition-all">Deploy Unlimited</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. CURRENT CAPABILITIES */}
      <section className="py-24 border-t border-[#253745] bg-[#11212D]" id="capabilities">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Current Capabilities</h2>
                <p className="text-[#9BA8AB]">Your ClawLink agent handles thousands of complex use cases instantly.</p>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {capabilities.map((cap, i) => (
                    <div key={i} className="bg-[#06141B] border border-[#253745] p-6 rounded-2xl hover:border-[#4A5C6A] transition-colors">
                        <div className="w-10 h-10 bg-[#11212D] border border-[#253745] rounded-lg flex items-center justify-center text-white mb-5">
                            {cap.icon}
                        </div>
                        <h3 className="text-base font-bold text-white mb-2">{cap.title}</h3>
                        <p className="text-xs text-[#9BA8AB] leading-relaxed">{cap.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 4. ROADMAP & LIMITATIONS */}
      <section className="py-24 border-t border-[#253745] bg-[#06141B]" id="roadmap">
        <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16">
                
                {/* Upcoming Roadmap */}
                <div>
                    <h2 className="text-3xl font-bold text-white mb-8">Upcoming Roadmap</h2>
                    <div className="space-y-4">
                        {roadmapFeatures.map((feat, i) => (
                            <div key={i} className="p-5 bg-[#11212D] border border-[#253745] rounded-2xl flex gap-4 items-start">
                                <div className="text-[#4A5C6A] mt-1">{feat.icon}</div>
                                <div>
                                    <h3 className="font-bold text-white text-sm mb-1">{feat.title}</h3>
                                    <p className="text-xs text-[#9BA8AB] leading-relaxed">{feat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Limitations & Risks */}
                <div>
                    <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                        <AlertTriangle className="text-[#ff3b30]"/> Limitations & Risks
                    </h2>
                    <div className="space-y-4">
                        {limitations.map((limit, i) => (
                            <div key={i} className="p-5 bg-[#11212D] border border-[#ff3b30]/20 rounded-2xl flex gap-4 items-start">
                                <div className="text-[#ff3b30] mt-1">{limit.icon}</div>
                                <div>
                                    <h3 className="font-bold text-white text-sm mb-1">{limit.title}</h3>
                                    <p className="text-xs text-[#9BA8AB] leading-relaxed">{limit.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
      </section>

      {/* 5. SETUP & DEPLOYMENT COMPARISON */}
      <section className="py-32 border-t border-[#253745] bg-[#11212D]" id="comparison">
        <div className="max-w-5xl mx-auto px-6">
            
            <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-[1px] w-12 bg-gradient-to-l from-[#ff3b30] to-transparent"></div>
                <span className="text-[#ff3b30] text-[13px] font-bold tracking-wider uppercase">Comparison</span>
                <div className="h-[1px] w-12 bg-gradient-to-r from-[#ff3b30] to-transparent"></div>
            </div>

            <h2 className="text-3xl text-center mb-24 font-bold text-white tracking-wide">
                Traditional Method vs ClawLink
            </h2>
            
            <div className="flex flex-col md:flex-row justify-between items-stretch gap-10">
                
                {/* Traditional Side */}
                <div className="w-full md:w-1/2">
                    <h3 className="text-base font-bold mb-6 italic text-[#9BA8AB]">Traditional</h3>
                    <div className="space-y-4 text-[13px] text-[#9BA8AB]">
                        {traditionalSteps.map((item, i) => (
                            <div key={i} className="flex justify-between border-b border-[#253745] pb-3">
                                <span>{item.step}</span>
                                <span className="text-[#4A5C6A] font-medium">{item.time}</span>
                            </div>
                        ))}
                        <div className="flex justify-between pt-4 text-lg font-bold text-white italic">
                            <span>Total</span>
                            <span>60 min</span>
                        </div>
                        <p className="text-[12px] mt-6 text-[#9BA8AB] italic">
                            If you're <span className="text-[#ff3b30] bg-[#ff3b30]/10 px-1 font-bold">non-technical</span>, multiply these <span className="text-[#ff3b30] font-bold">times by 10</span> — you have to learn each step before doing.
                        </p>
                    </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block w-px bg-[#253745] min-h-full mx-4"></div>

                {/* ClawLink Side */}
                <div className="w-full md:w-1/2 pt-10 md:pt-20 md:pl-6">
                    <h3 className="text-base font-bold mb-4 italic text-[#9BA8AB]">ClawLink</h3>
                    <div className="text-5xl font-bold text-white mb-6">&lt;1 min</div>
                    <p className="text-[#9BA8AB] text-[14px] leading-relaxed mb-6">
                        Pick a model, connect Telegram, deploy — done under 1 minute.
                    </p>
                    <p className="text-[#9BA8AB] text-[14px] leading-relaxed">
                        Servers, SSH and OpenClaw Environment are already set up, waiting to get assigned. Simple, secure and fast connection to your bot.
                    </p>
                </div>

            </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-[#253745] text-center text-sm text-[#4A5C6A] bg-[#06141B]">
        <p>© 2026 ClawLink. All rights reserved. FastClaw's reliability + SimpleClaw's speed.</p>
      </footer>
    </div>
  );
}