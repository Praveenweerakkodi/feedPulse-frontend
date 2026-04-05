import React from "react";
import { Layers, Lightbulb, Clock, Hash } from "lucide-react";

interface StatsProps {
  total: number;
  openItems: number;
  avgPriority: number | null;
  topTag: string | null;
}

export default function StatsBar({
  total,
  openItems,
  avgPriority,
  topTag,
}: StatsProps) {
  const boxStyle =
    "bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 p-6 rounded-2xl flex items-center space-x-6 h-full";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full">
      {/*Total Feedback */}
      <div className={boxStyle}>
        <div className="bg-indigo-500/10 text-indigo-400 p-4 rounded-xl border border-indigo-500/20">
          <Layers size={28} />
        </div>
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">
            Total Received
          </p>
          <p className="text-3xl font-bold text-slate-100">{total}</p>
        </div>
      </div>

      {/*Open Items */}
      <div className={boxStyle}>
        <div className="bg-amber-500/10 text-amber-400 p-4 rounded-xl border border-amber-500/20">
          <Clock size={28} />
        </div>
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">
            Needs Review
          </p>
          <p className="text-3xl font-bold text-slate-100">{openItems}</p>
        </div>
      </div>

      {/*Avg Priority */}
      <div className={boxStyle}>
        <div className="bg-rose-500/10 text-rose-400 p-4 rounded-xl border border-rose-500/20">
          <Lightbulb size={28} />
        </div>
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">
            Avg AI Priority
          </p>
          <p className="text-3xl font-bold text-slate-100">
            {avgPriority ? avgPriority.toFixed(1) : "-"}{" "}
            <span className="text-sm font-normal text-slate-500">/10</span>
          </p>
        </div>
      </div>

      {/*Top Trending Tag */}
      <div className={boxStyle}>
        <div className="bg-teal-500/10 text-teal-400 p-4 rounded-xl border border-teal-500/20">
          <Hash size={28} />
        </div>
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">
            Trending Tag
          </p>
          <p className="text-xl font-bold text-slate-100 uppercase tracking-wide line-clamp-1">
            {topTag || "None"}
          </p>
        </div>
      </div>
    </div>
  );
}
