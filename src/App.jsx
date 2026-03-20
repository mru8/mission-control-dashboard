import React, { useState, useEffect } from 'react';
import MetricCard from './components/MetricCard';

function App() {
  // 1. STATE: Memory for our live data
  const [cpu, setCpu] = useState(40);
  const [network, setNetwork] = useState(850);
  const [logs, setLogs] = useState([
    { id: 1, text: "System Initialized", time: new Date().toLocaleTimeString() },
  ]);

  // 2. EFFECTS: The "Heartbeats" (Intervals)
  useEffect(() => {
    const cpuInterval = setInterval(() => {
      const randomValue = Math.floor(Math.random() * (95 - 30 + 1)) + 30;
      setCpu(randomValue);
    }, 2000);

    const netInterval = setInterval(() => {
      setNetwork(Math.floor(Math.random() * (950 - 100 + 1)) + 100);
    }, 500);

    return () => {
      clearInterval(cpuInterval);
      clearInterval(netInterval);
    };
  }, []);

  // 3. WATCHER: Logic to add alert when CPU is high
  useEffect(() => {
    if (cpu > 85) {
      const newLog = {
        id: Date.now(),
        text: `WARNING: High CPU Usage (${cpu}%)`,
        time: new Date().toLocaleTimeString(),
      };
      // Keep only the 5 most recent logs
      setLogs(prev => [newLog, ...prev].slice(0, 5));
    }
  }, [cpu]);

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-50 overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-slate-800 p-6 flex flex-col gap-8 bg-slate-950">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
          <h1 className="text-xl font-bold tracking-tighter text-white">MISSION CONTROL</h1>
        </div>
        <nav className="flex flex-col gap-2 text-slate-400">
          <div className="p-2 bg-slate-900 text-white rounded-lg cursor-pointer transition-all">Dashboard</div>
          <div className="p-2 hover:bg-slate-900 hover:text-white rounded-lg cursor-pointer transition-all">System Logs</div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col bg-slate-950/50">
        
        {/* HEADER */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-semibold tracking-wide text-slate-200 uppercase">System Online</span>
          </div>
        </header>

        {/* BENTO GRID */}
        <div className="p-8 grid grid-cols-4 grid-rows-3 gap-6 flex-1 overflow-hidden">
          
          {/* 1. CPU CARD */}
          <MetricCard 
            title="CPU Usage" 
            value={cpu} 
            unit="%" 
            trend={cpu > 80 ? "CRITICAL" : "+2.1%"} 
            colorClass={cpu > 80 ? "text-red-500" : "text-blue-400"} 
          />
          
          {/* 2. RAM CARD */}
          <MetricCard 
            title="System RAM" 
            value="12.4" 
            unit="GB" 
            trend="-0.5%" 
            colorClass="text-purple-400" 
          />
          
          {/* 3. NETWORK CARD */}
          <MetricCard 
            title="Network Speed" 
            value={network} 
            unit="kbps" 
            trend={network > 800 ? "PEAK" : "STABLE"} 
            colorClass={network > 800 ? "text-green-400" : "text-slate-400"} 
          />
          
          {/* 4. LIVE ALERTS PANEL (Right Column - Spans all rows) */}
          <div className="col-start-4 row-start-1 row-span-3 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col overflow-hidden">
            <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Live Alerts</h3>
            <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar">
              {logs.length === 0 ? (
                <p className="text-slate-600 text-xs italic">Monitoring...</p>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="border-l-2 border-red-500 bg-red-500/10 p-3 rounded-r-lg animate-in fade-in slide-in-from-right-4 duration-500">
                    <span className="text-[10px] font-mono text-red-400/80 block mb-1">{log.time}</span>
                    <p className="text-[11px] text-slate-200 font-medium leading-tight">{log.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 5. MAIN VISUALIZER (Center-Left) */}
          <div className="col-span-3 row-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center text-slate-700 font-bold tracking-[0.3em]">
            <div className="w-full h-full border border-dashed border-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden">
              <span className="z-10 bg-slate-950 px-4">LIVE_VISUALIZER_CORE</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent animate-pulse"></div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}

export default App;