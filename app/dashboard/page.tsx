"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LogOut, Zap, Activity, Settings, Database, Server, RefreshCcw, Save } from 'lucide-react';

// --- SAFE SUPABASE INITIALIZATION ---
// This prevents errors if .env is missing or loading late.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyz123.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Dummy key

// Only create the client if we have the actual URL, otherwise use a dummy one to prevent crashes during build
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Real Database States
  const [botData, setBotData] = useState<any>(null);
  const [prompt, setPrompt] = useState("");

  // Real-time Auth & Fetch Data Check
  useEffect(() => {
    const getUserAndData = async () => {
      try {
        // 1. Check Asli User
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setUser(session.user);
          
          // 2. Fetch Asli Bot Data for this user
          const { data: bot, error } = await supabase
            .from('bots')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (bot) {
            setBotData(bot);
            setPrompt(bot.prompt);
          } else {
            // Naya bot create karo
            const { data: newBot } = await supabase.from('bots').insert([
              { user_id: session.user.id }
            ]).select().single();
            
            setBotData(newBot);
            setPrompt(newBot?.prompt || "");
          }
        } else {
          // Bina login waale ko wapas fek do
          window.location.href = '/'; 
        }
      } catch (err) {
        console.error("Dashboard Loading Error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    getUserAndData();
  }, []);

  // Asli Logout
  const handleRealLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  // Asli Database Save
  const handleUpdateInstructions = async () => {
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('bots')
        .update({ prompt: prompt })
        .eq('user_id', user.id);

      if (error) throw error;
      alert("Automation rules updated successfully in database!");
    } catch (error: any) {
      alert("Error saving data: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06141B] flex flex-col items-center justify-center">
         <RefreshCcw size={40} className="text-[#4A5C6A] animate-spin mb-4" />
         <p className="text-[#9BA8AB] font-bold tracking-widest uppercase text-sm">Connecting to Cloud Server...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06141B] text-[#CCD0CF] font-sans selection:bg-[#4A5C6A]">
      
      <nav className="w-full bg-[#11212D] border-b border-[#253745] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl text-white">
          <div className="w-8 h-8 bg-[#CCD0CF] rounded flex items-center justify-center text-[#06141B]">
            <Zap size={18} fill="currentColor"/>
          </div>
          ClawLink Control Panel
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm font-semibold text-[#9BA8AB] hidden md:block">
            {user?.email}
          </div>
          <button 
            onClick={handleRealLogout} 
            className="flex items-center gap-2 bg-[#253745] hover:bg-[#4A5C6A] text-white px-4 py-2 rounded-lg transition-all text-sm font-bold shadow-md"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 mt-8">
        <h1 className="text-3xl font-bold text-white mb-8">System Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#11212D] border border-[#253745] p-6 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Server size={24} className="text-[#3B82F6]" />
              <h2 className="text-lg font-bold text-white">Active Engine</h2>
            </div>
            <div className="text-2xl font-black text-white mb-2">{botData?.model || "Not set"}</div>
            <p className="text-sm text-[#9BA8AB]">Channel: <span className="font-bold text-[#CCD0CF]">{botData?.channel || "Telegram"}</span></p>
          </div>

          <div className="bg-[#11212D] border border-[#253745] p-6 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Activity size={24} className="text-[#D97757]" />
              <h2 className="text-lg font-bold text-white">AI Credits</h2>
            </div>
            <div className="text-4xl font-black text-white mb-2">{botData?.credits || 0} <span className="text-sm text-[#4A5C6A] font-medium">/ 500</span></div>
            <div className="w-full bg-[#06141B] rounded-full h-2 mb-2 mt-4">
              <div className="bg-[#D97757] h-2 rounded-full" style={{ width: `${((botData?.credits || 0) / 500) * 100}%` }}></div>
            </div>
          </div>

          <div className="bg-[#11212D] border border-[#253745] p-6 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Database size={24} className="text-[#CCD0CF]" />
              <h2 className="text-lg font-bold text-white">Instance Status</h2>
            </div>
            <div className="text-3xl font-black text-green-500 mb-2 capitalize">{botData?.status || "Running"}</div>
            <p className="text-sm text-[#9BA8AB]">Server connected and monitoring.</p>
          </div>
        </div>

        {/* --- Asli Master Prompt Area --- */}
        <div className="mt-8 bg-[#11212D] border border-[#253745] p-8 rounded-2xl shadow-xl">
           <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
             <Settings size={20} className="text-[#9BA8AB]" /> Edit Automation Prompt
           </h2>
           <textarea 
             className="w-full h-40 bg-[#06141B] border border-[#253745] rounded-xl p-4 text-[#CCD0CF] focus:border-[#4A5C6A] outline-none resize-none font-medium transition-colors"
             placeholder="Instruct your agent here... (e.g. Translate messages to English)"
             value={prompt}
             onChange={(e) => setPrompt(e.target.value)}
           ></textarea>
           
           <div className="mt-6 flex justify-end">
             <button 
               onClick={handleUpdateInstructions}
               disabled={isSaving}
               className="bg-[#CCD0CF] text-[#06141B] px-6 py-3 rounded-xl font-bold hover:bg-white transition-all flex items-center gap-2 shadow-lg"
             >
               {isSaving ? <RefreshCcw size={18} className="animate-spin" /> : <Save size={18} />}
               {isSaving ? 'Saving to Database...' : 'Save & Deploy to Bot'}
             </button>
           </div>
        </div>

      </main>
    </div>
  );
}