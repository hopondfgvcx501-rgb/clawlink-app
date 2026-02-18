"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Activity, Box, Cpu, Settings, Terminal, LogOut, Plus, 
  Shield, Trash2, Zap, Server, Search, Bell 
} from 'lucide-react';

// --- DIRECT SUPABASE CONNECTION (No Import Errors) ---
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<any[]>([]);
  const [deploying, setDeploying] = useState(false);

  // 1. Check User & Load Agents
  useEffect(() => {
    const init = async () => {
      // Session check
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setUser(session.user);
        fetchAgents(session.user.id);
      } else {
        // Fallback for demo flow (Agar login skip kiya ho)
        const demoUser = { email: 'demo@clawlink.com', id: 'demo-user-123' };
        setUser(demoUser);
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchAgents = async (userId: string) => {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (data) setAgents(data);
    setLoading(false);
  };

  // 2. Deploy New Agent Function
  const handleDeployAgent = async () => {
    setDeploying(true);
    
    // Retrieve choices from Landing Page
    const storedModel = localStorage.getItem('pendingModel') || 'Claude 4.6';
    const newAgentName = `Claw-${Math.floor(Math.random() * 1000)}`; 
    const currentUserId = user?.id || 'demo-user-123';
    
    // Asli deployment feel dene ke liye 1.5 second ka delay
    setTimeout(async () => {
        // Database mein insert karein
        const { data, error } = await supabase
        .from('agents')
        .insert([
            { 
                user_id: currentUserId,
                name: newAgentName, 
                model: storedModel, 
                status: 'active' 
            }
        ])
        .select();

        if (error) {
            // Agar RLS policy error aaye (demo mode mein), toh local state update karein
            console.log("Using local state fallback due to DB policy");
            const fakeAgent = {
                id: Math.random().toString(),
                name: newAgentName,
                model: storedModel,
                status: 'active',
                created_at: new Date().toISOString()
            };
            setAgents([fakeAgent, ...agents]);
        } else {
            if (data) setAgents([data[0], ...agents]);
        }
        setDeploying(false);
    }, 1500);
  };

  // 3. Delete Agent Function
  const handleDeleteAgent = async (id: string) => {
    if(!window.confirm("Are you sure you want to terminate this instance?")) return;

    await supabase.from('agents').delete().eq('id', id);
    // UI se bhi hatayein
    setAgents(agents.filter(agent => agent.id !== id));
  };

  // 4. Logout Function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-medium text-slate-500">
      Loading Command Center...
    </div>
  );

  return (
    // ✨ WHITE DASHBOARD THEME (Matches Landing Page)
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
             {/* Logo */}
             <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center font-bold text-white shadow-md">C</div>
             <span className="font-bold text-lg tracking-tight text-slate-900">ClawLink</span>
          </div>
          
          <nav className="space-y-1">
            <div className="bg-slate-100 text-slate-900 px-3 py-2 rounded-lg flex items-center gap-3 text-sm font-semibold cursor-pointer">
                <Box size={18} /> Overview
            </div>
            <div className="text-slate-500 hover:bg-slate-50 hover:text-slate-900 px-3 py-2 rounded-lg flex items-center gap-3 text-sm font-medium cursor-pointer transition">
                <Terminal size={18} /> Live Logs
            </div>
            <div className="text-slate-500 hover:bg-slate-50 hover:text-slate-900 px-3 py-2 rounded-lg flex items-center gap-3 text-sm font-medium cursor-pointer transition">
                <Activity size={18} /> Analytics
            </div>
            <div className="text-slate-500 hover:bg-slate-50 hover:text-slate-900 px-3 py-2 rounded-lg flex items-center gap-3 text-sm font-medium cursor-pointer transition">
                <Settings size={18} /> Settings
            </div>
          </nav>
        </div>

        <div className="p-6 border-t border-slate-100">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="text-xs overflow-hidden">
                    <div className="text-slate-900 font-bold truncate w-32">Admin User</div>
                    <div className="text-slate-500 truncate w-32">{user?.email}</div>
                </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 text-xs text-red-600 hover:bg-red-50 p-2 rounded-lg transition font-medium">
                <LogOut size={14} /> Sign Out
            </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500">Manage your active AI workforce.</p>
            </div>
            <div className="flex items-center gap-3">
                <button className="p-2 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg bg-white transition">
                    <Bell size={18} />
                </button>
                <button 
                    onClick={handleDeployAgent}
                    disabled={deploying}
                    className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-200 disabled:opacity-70"
                >
                    {deploying ? <Activity className="animate-spin" size={16}/> : <Plus size={16} />}
                    {deploying ? "Provisioning..." : "Deploy New Instance"}
                </button>
            </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Cpu size={20} />
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Active</span>
                </div>
                <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Total Instances</div>
                <div className="text-3xl font-bold text-slate-900">{agents.length}</div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                        <Activity size={20} />
                    </div>
                </div>
                <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">System Uptime</div>
                <div className="text-3xl font-bold text-slate-900">99.9%</div>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                        <Zap size={20} />
                    </div>
                </div>
                <div className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Current Plan</div>
                <div className="text-3xl font-bold text-slate-900">Free Tier</div>
            </div>
        </div>

        {/* --- AGENTS LIST --- */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    Active Containers
                </h3>
                <div className="text-xs text-slate-500">
                    Real-time Status
                </div>
            </div>

            {agents.length === 0 ? (
                // Empty State
                <div className="p-12 text-center flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                        <Server size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No Instances Running</h3>
                    <p className="text-sm text-slate-500 max-w-sm mt-2 mb-6">
                        You haven't deployed any AI agents yet. Click the button above to start your first instance.
                    </p>
                </div>
            ) : (
                // Agents Table List
                <div className="divide-y divide-slate-100">
                    {agents.map((agent) => (
                        <div 
                            key={agent.id} 
                            // ✨ Added Navigation to Terminal Page
                            onClick={() => router.push(`/dashboard/agent/${agent.id}`)}
                            className="p-4 flex items-center justify-between hover:bg-slate-50 transition group cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
                                    <Terminal size={18} />
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-slate-900">{agent.name}</div>
                                    <div className="text-xs text-slate-500 flex items-center gap-2">
                                        {agent.model} • <span className="text-green-600">Running</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                <div className="hidden md:block text-right">
                                    <div className="text-[10px] text-slate-400 uppercase font-bold">Memory</div>
                                    <div className="text-xs font-mono text-slate-700">256MB / 512MB</div>
                                </div>
                                <div className="hidden md:block text-right">
                                    <div className="text-[10px] text-slate-400 uppercase font-bold">CPU</div>
                                    <div className="text-xs font-mono text-slate-700">12%</div>
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Parent click rokne ke liye
                                        handleDeleteAgent(agent.id);
                                    }}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                    title="Terminate Instance"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

      </main>
    </div>
  );
}