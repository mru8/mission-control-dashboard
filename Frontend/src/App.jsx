import React, { useState, useEffect } from 'react';
import MetricCard from './components/MetricCard';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

function App() {
  // Real data state streams
  const [currentMetrics, setCurrentMetrics] = useState({ cpu: 0, ram: 0, network: 0 });
  const [history, setHistory] = useState([]);
  const [logs, setLogs] = useState([
    { id: 'init', text: "Telemetry Channel Initialized", time: new Date().toLocaleTimeString() }
  ]);
  const [connected, setConnected] = useState(false);

  // Connect to FastAPI Live WebSocket Stream
  useEffect(() => {
    // Locate local backend port. Standard Uvicorn port is 8000
    const ws = new WebSocket('ws://localhost:8000/ws/stats');

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // 1. Update current absolute numbers
      setCurrentMetrics({
        cpu: data.cpu,
        ram: data.ram,
        network: data.network
      });

      // 2. Append to historical data matrix (Cap at last 25 ticks to protect memory)
      setHistory((prevHistory) => {
        const updated = [...prevHistory, { time: data.timestamp, CPU: data.cpu, RAM: data.ram }];
        if (updated.length > 25) updated.shift();
        return updated;
      });

      // 3. Evaluate alerts sent from backend
      if (data.has_alert) {
        setLogs((prevLogs) => {
          const newAlert = {
            id: Date.now(),
            text: data.alert_text,
            time: data.timestamp
          };
          // Clamp logs to last 8 notifications
          return [newAlert, ...prevLogs].slice(0, 8);
        });
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-slate-950 text-slate-50 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-row md:flex-col justify-between md:justify-start gap-8 bg-slate-950">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
          <h1 className="text-xl font-bold tracking-tighter text-white">MISSION CONTROL</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-xs text-slate-400 font-mono">{connected ? "STREAM_LIVE" : "DISCONNECTED"}</span>
        </div>
      </aside>

      {/* MAIN LAYOUT ENGINE */}
      <main className="flex-1 flex flex-col min-h-0">
        
        {/* GRID CONTAINER */}
        <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-max flex-1 overflow-y-auto">
          
          {/* STAT CARD UNITS */}
          <MetricCard 
            title="Real-Time CPU" 
            value={currentMetrics.cpu} 
            unit="%" 
            trend={currentMetrics.cpu > 85 ? "CRITICAL" : "LIVE"} 
            colorClass={currentMetrics.cpu > 85 ? "text-red-500" : "text-blue-400"} 
          />
          <MetricCard 
            title="Physical RAM" 
            value={currentMetrics.ram} 
            unit="%" 
            trend={currentMetrics.ram > 90 ? "CRITICAL" : "STABLE"} 
            colorClass={currentMetrics.ram > 90 ? "text-red-500" : "text-purple-400"} 
          />
          <MetricCard 
            title="Net Accumulation" 
            value={currentMetrics.network} 
            unit="kb" 
            trend="I/O COUNTER" 
            colorClass="text-emerald-400" 
          />

          {/* SYSTEM NOTIFICATIONS / ALERTS */}
          <div className="md:col-start-4 md:row-start-1 md:row-span-3 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col max-h-[400px] md:max-h-none overflow-hidden">
            <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Event Logs</h3>
            <div className="flex flex-col gap-3 overflow-y-auto pr-1">
              {logs.map((log) => (
                <div key={log.id} className={`border-l-2 ${log.text.includes('CRITICAL') ? 'border-red-500 bg-red-500/5' : 'border-slate-700 bg-slate-800/20'} p-3 rounded-r-lg`}>
                  <span className="text-[10px] font-mono text-slate-500 block mb-1">{log.time}</span>
                  <p className="text-[11px] text-slate-300 font-medium leading-tight">{log.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* HISTORICAL CHART VISUALIZER */}
          <div className="md:col-span-3 md:row-span-2 bg-slate-900/30 border border-slate-800 rounded-2xl p-6 min-h-[350px] flex flex-col">
            <div className="mb-4">
              <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Hardware Performance Timeline</h3>
              <p className="text-xs text-slate-400">Continuous 1-second system resource pooling status</p>
            </div>
            <div className="flex-1 w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="cpuColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="ramColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c084fc" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" tickLine={false} style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                  <YAxis domain={[0, 100]} stroke="#64748b" tickLine={false} style={{ fontSize: '10px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="CPU" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#cpuColor)" />
                  <Area type="monotone" dataKey="RAM" stroke="#c084fc" strokeWidth={2} fillOpacity={1} fill="url(#ramColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;