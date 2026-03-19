import React from 'react';

const MetricCard = ({title, value, unit, trend, colorClass}) => {
    return (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all group cursor-default">
            <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">{title}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 ${colorClass}`}>
                {trend}
            </span>
            </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-mono font-bold text-white group-hover:text-blue-400 transition-colors">
          {value}
        </span>
        <span className="text-slate-500 text-xs font-medium uppercase">{unit}</span>
      </div>
    </div>
  );
};

export default MetricCard;
    
