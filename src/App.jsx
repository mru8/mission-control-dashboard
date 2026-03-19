import React from 'react';
import MetricCard from './components/MetricCard';

function App() {
  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-50 overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-slate-800 p-6 flex flex-col gap-8 bg-slate-950">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
          <h1 className="text-xl font-bold tracking-tighter text-white">MISSION CONTROL</h1>
        </div>
        <nav className="flex flex-col gap-2 text-slate-400">
          <div className="p-2 hover:bg-slate-900 hover:text-white rounded-lg cursor-pointer transition-all">Dashboard</div>
          <div className="p-2 hover:bg-slate-900 hover:text-white rounded-lg cursor-pointer transition-all">System Logs</div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col bg-slate-950/50">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-semibold tracking-wide text-slate-200">SYSTEM ONLINE</span>
          </div>
        </header>

        {/* BENTO GRID */}
        <div className="p-8 grid grid-cols-4 grid-rows-3 gap-6 flex-1">
          <MetricCard title="CPU Usage" value="42" unit="%" trend="+2.1%" colorClass="text-blue-400" />
          <MetricCard title="System RAM" value="12.4" unit="GB" trend="-0.5%" colorClass="text-purple-400" />
          <MetricCard title="Network" value="850" unit="kbps" trend="Stable" colorClass="text-green-400" />
          <div className="col-span-3 row-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex justify-center items-center text-slate-700 font-bold">LIVE VISUALIZER</div>
          <div className="col-span-1 row-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex justify-center items-center text-slate-700 font-bold">ALERTS</div>
        </div>
      </main>
    </div>
  );
}

export default App;