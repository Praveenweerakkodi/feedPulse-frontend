import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button, CircularProgress } from '@mui/material';

interface AIInsightPanelProps {
  summary: string | null;
  loading: boolean;
  onRefresh: () => void;
}

export default function AIInsightPanel({ summary, loading, onRefresh }: AIInsightPanelProps) {
  return (
    <div className="glass-panel p-6 border-indigo-500/30 overflow-hidden relative">
      {/* Background glow specific to insights */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />
      
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-500/20 text-indigo-400 p-2 rounded-lg">
            <Lightbulb size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">What should we build next?</h2>
            <p className="text-sm text-slate-400">Weekly AI trend extraction from user feedback.</p>
          </div>
        </div>
        
        <Button 
          variant="outlined" 
          size="small"
          onClick={onRefresh}
          disabled={loading}
          sx={{ 
            borderColor: 'rgba(99, 102, 241, 0.5)', 
            color: '#818cf8',
            '&:hover': { borderColor: '#6366f1', backgroundColor: 'rgba(99, 102, 241, 0.1)' }
          }}
        >
          {loading ? <CircularProgress size={16} color="inherit" /> : 'Generate Summary'}
        </Button>
      </div>

      <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50 min-h-[120px]">
        {loading ? (
          <div className="flex flex-col flex-1 items-center justify-center space-y-3 h-full pt-4 pb-4">
            <CircularProgress size={24} sx={{ color: '#818cf8' }} />
            <span className="text-sm text-slate-400 animate-pulse">Gemini is analyzing the week's data...</span>
          </div>
        ) : summary ? (
          <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
            {summary}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 h-full text-slate-500 py-6">
            <AlertTriangle size={24} className="opacity-50" />
            <p>No summary generated yet. Click above to analyze recent feedback.</p>
          </div>
        )}
      </div>
      
      {/* Visual touch: Differentiator highlighting Why this matters */}
      {!loading && summary && (
        <div className="mt-4 flex items-center space-x-2 text-xs text-indigo-400/80">
          <TrendingUp size={14} />
          <span>Product strategy based on real user pain points.</span>
        </div>
      )}
    </div>
  );
}
