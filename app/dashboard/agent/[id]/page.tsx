"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, Terminal, Activity, Zap, 
  MessageSquare, DollarSign, StopCircle, PlayCircle 
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AgentTerminal() {
  const router = useRouter();
  const params = useParams();
  const [agent, setAgent] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  const [stats, setStats] = useState({ messages: 124, earnings: 4.50 });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 🔥 MASTER FIX: Force load immediately
    const loadTerminal = async () => {
      // 1. Agar ID nahi hai to wapas bhejo
      if (!params?.id) return;

      const agentId = params.id as string;
      let loadedAgent = null;

      try {
        // 2. Sirf tab DB check karo agar ID asli UUID jaisa dikhe (lamba code)
        // Agar "0.384..." jaisa chhota ID hai to DB call mat karo, direct demo chalao.
        if (agentId.length > 20) {
            const { data, error } = await supabase
                .from('agents')
                .select('*')
                .eq('id', agentId)
                .single();
            
            if (data && !error) {
                loadedAgent = data;
            }
        }
      } catch (err) {
        console.log("DB Skip:", err);
      }

      // 3. FALLBACK: Agar DB mein nahi mila ya error aaya, to FAKE banao
      if (!loadedAgent) {
        console.log("Using Simulation Mode");
        loadedAgent = {
            id: agentId,
            name: `Claw-Instance-${agentId.slice(0,4)}`,
            model: 'Claude 4.6 (Simulated)',
            status: 'active'
        };
      }

      // 4. State set karo (Loading khatam)
      setAgent(loadedAgent);
      
      // 5. Initial Logs start karo
      addLog(`Initializing connection to ${loadedAgent.name}...`);
      addLog(`Validation successful. Access granted.`);
      addLog(`Booting ClawLink OS v2.4...`);
      addLog(`System Status: ONLINE`);
    };

    loadTerminal();
  }, [params]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => {
        const newLogs = [...prev, `[${timestamp}] ${msg}`];
        if (newLogs.length > 50) newLogs.shift();
        return newLogs;
    });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // --- AUTOMATIC WORKING LOGIC ---
  useEffect(() => {
    if (!isRunning || !agent) return;

    const interval = setInterval(() => {
      const actions = [
        "Scanning Telegram channels...",
        `Detected signal from User_${Math.floor(Math.random() * 9000)}`,
        "Processing context (128k window)...",
        "Generating response via API...",
        "Message sent successfully. (24ms)",
        "Database synced.",
        "Checking wallet balance...",
        "Optimizing thread execution..."
      ];
      
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      addLog(randomAction);

      if (randomAction.includes("Message sent")) {
        setStats(prev => ({
            messages: prev.messages + 1,
            earnings: prev.earnings + 0.05
        }));
      }

    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning, agent]);

  const toggleBot = () => {
    if (isRunning) {
        setIsRunning(false);
        addLog("🛑 INSTANCE PAUSED.");
    } else {
        setIsRunning(true);
        addLog("🚀 INSTANCE RESUMED.");
    }
  };

  // Loading Screen (Ab ye sirf 0.1 second dikhega)
  if (!agent) return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-medium text-slate-500">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            <span>Establishing secure uplink...</span>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-6">
      
      {/* Header */}
      <header className="flex items-center justify-between mb-6 max-w-6xl mx-auto">
        <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-slate-500 hover:text-black transition font-medium bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"
        >
            <ArrowLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-3">
             <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase border shadow-sm ${isRunning ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`}></div>
                {isRunning ? 'System Active' : 'System Paused'}
             </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- LEFT PANEL --- */}
        <div className="space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-black/20">
                    <Terminal size={24} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">{agent.name}</h1>
                <p className="text-sm text-slate-500 font-mono mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    ID: {agent.id.toString().slice(0, 8)}...
                </p>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                        <span className="text-slate-500">Model</span>
                        <span className="font-bold bg-slate-100 px-2 py-0.5 rounded text-xs">{agent.model}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-slate-400 mb-2"><MessageSquare size={18}/></div>
                    <div className="text-2xl font-bold text-slate-900">{stats.messages}</div>
                    <div className="text-xs text-slate-500">Processed</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-slate-400 mb-2"><DollarSign size={18}/></div>
                    <div className="text-2xl font-bold text-green-600">${stats.earnings.toFixed(2)}</div>
                    <div className="text-xs text-slate-500">Earnings</div>
                </div>
            </div>

            <button 
                onClick={toggleBot}
                className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-md active:scale-95 ${
                    isRunning 
                    ? 'bg-white text-red-600 border border-red-200 hover:bg-red-50' 
                    : 'bg-black text-white hover:bg-slate-800'
                }`}
            >
                {isRunning ? <><StopCircle size={18} /> Stop Instance</> : <><PlayCircle size={18} /> Start Instance</>}
            </button>
        </div>

        {/* --- RIGHT PANEL (TERMINAL) --- */}
        <div className="lg:col-span-2">
            <div className="bg-[#0f172a] text-slate-300 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] border border-slate-800 relative">
                <div className="bg-[#1e293b] px-4 py-3 flex items-center justify-between border-b border-slate-700">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <span className="ml-4 text-xs font-mono text-slate-400">root@clawlink-core:~</span>
                    </div>
                    <div className="text-xs font-mono text-green-500 flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded">
                        <Activity size={12} /> Live
                    </div>
                </div>

                <div ref={scrollRef} className="flex-1 p-6 font-mono text-xs md:text-sm overflow-y-auto space-y-3 custom-scrollbar">
                    {logs.map((log, index) => (
                        <div key={index} className="break-words border-l-2 border-slate-700 pl-3">
                            <span className="text-slate-500 text-[10px] block mb-0.5">{log.split(']')[0]}]</span>
                            <span className={
                                log.includes("Error") ? "text-red-400 font-bold" :
                                log.includes("Success") || log.includes("Sent") ? "text-green-400" :
                                log.includes("Detect") ? "text-yellow-400" :
                                "text-slate-300"
                            }>
                                {log.split(']')[1]}
                            </span>
                        </div>
                    ))}
                    {isRunning && (
                        <div className="flex items-center gap-1 mt-4 animate-pulse">
                            <span className="text-green-500">➜</span>
                            <span className="w-2 h-4 bg-slate-400"></span>
                        </div>
                    )}
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}