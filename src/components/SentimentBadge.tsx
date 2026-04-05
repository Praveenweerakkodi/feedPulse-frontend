import React from 'react';
import { Smile, Meh, Frown, Sparkles } from 'lucide-react';

interface SentimentBadgeProps {
  sentiment?: 'Positive' | 'Neutral' | 'Negative' | 'AI Pending';
}

export default function SentimentBadge({ sentiment }: SentimentBadgeProps) {
  // Config map for different sentiments
  const config = {
    'Positive': {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      icon: <Smile size={14} className="mr-1.5" />
    },
    'Neutral': {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      text: 'text-indigo-400',
      icon: <Meh size={14} className="mr-1.5" />
    },
    'Negative': {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      text: 'text-rose-400',
      icon: <Frown size={14} className="mr-1.5" />
    },
    'AI Pending': {
      bg: 'bg-slate-700/50',
      border: 'border-slate-600',
      text: 'text-slate-400',
      icon: <Sparkles size={14} className="mr-1.5 animate-pulse" />
    }
  };

  const style = config[sentiment || 'AI Pending'];

  return (
    <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${style.bg} ${style.border} ${style.text}`}>
      {style.icon}
      {sentiment || 'AI Pending'}
    </div>
  );
}
