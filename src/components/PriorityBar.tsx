import React from "react";

interface PriorityBarProps {
  score: number;
}

export default function PriorityBar({ score }: PriorityBarProps) {
  let colorClass = "";
  let label = "";

  if (score >= 8) {
    colorClass = "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]";
    label = "Critical";
  } else if (score >= 5) {
    colorClass = "bg-amber-400";
    label = "Medium";
  } else {
    colorClass = "bg-teal-400";
    label = "Low";
  }

  const widthPercentage = `${(score / 10) * 100}%`;

  return (
    <div
      className="flex flex-col space-y-1 w-full"
      title={`Priority: ${score}/10`}
    >
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-400">
          P<span className="font-semibold text-slate-300">{score}</span>
        </span>
        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
          {label}
        </span>
      </div>

      {/* Background track */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        {/* Filled bar */}
        <div
          className={`h-full rounded-full transition-all duration-1000 ${colorClass}`}
          style={{ width: widthPercentage }}
        />
      </div>
    </div>
  );
}
