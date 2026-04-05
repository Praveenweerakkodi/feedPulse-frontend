import React from 'react';
import { 
  Menu, MenuItem, IconButton, CircularProgress, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box
} from '@mui/material';
import { MoreVertical, Trash2, Edit3, MessageSquare, MonitorPlay } from 'lucide-react';
import PriorityBar from './PriorityBar';
import SentimentBadge from './SentimentBadge';

export interface FeedbackItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  submitterName?: string;
  submitterEmail?: string;
  ai_category?: string;
  ai_sentiment?: 'Positive' | 'Neutral' | 'Negative';
  ai_priority?: number;
  ai_summary?: string;
  ai_tags?: string[];
  ai_processed: boolean;
  createdAt: string;
}

interface FeedbackCardProps {
  item: FeedbackItem;
  onUpdateStatus: (id: string, newStatus: string) => Promise<void>;
  onReanalyze: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function FeedbackCard({ item, onUpdateStatus, onReanalyze, onDelete }: FeedbackCardProps) {
  // ---- Material UI Dropdown Menu State ----
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // ---- Delete Confirmation Dialog State ----
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  // Status handlers
  const handleStatusChange = (status: string) => {
    onUpdateStatus(item._id, status);
    handleClose();
  };

  const handleReanalyzeClick = () => {
    onReanalyze(item._id);
    handleClose();
  };

  // Format date cleanly
  const dateStr = new Date(item.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <>
      {/* The main card wrapper */}
      <div className="glass-card p-5 hover:bg-slate-800/80 transition-colors group relative overflow-hidden">
        
        {/* Top Row: Meta info and Action Menu */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
            <span className="text-slate-300">{dateStr}</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            
            {/* User provided category */}
            <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">
              {item.category}
            </span>
            
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            
            {/* Status Badge*/}
            <span className={`px-2 py-0.5 rounded-full border ${
              item.status === 'New' ? 'border-sky-500/30 text-sky-400 bg-sky-500/10' :
              item.status === 'In Review' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' :
              'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
            }`}>
              {item.status}
            </span>
          </div>

          <IconButton size="small" onClick={handleClick} className="text-slate-400 hover:text-white">
            <MoreVertical size={16} />
          </IconButton>
        </div>

        {/* Content: Title & AI Summary */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-100 leading-snug mb-2">{item.title}</h3>
          
          <div className="text-sm text-slate-400 line-clamp-2">
            {item.ai_processed ? (
              <span className="flex items-start">
                <MonitorPlay size={14} className="mt-0.5 mr-1.5 text-indigo-400 flex-shrink-0" />
                <span className="text-slate-300">{item.ai_summary}</span>
              </span>
            ) : (
              <span className="flex items-start opacity-70">
                <MessageSquare size={14} className="mt-0.5 mr-1.5 flex-shrink-0" />
                <span>{item.description}</span>
              </span>
            )}
          </div>
        </div>

        {/* Bottom Row*/}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-4 border-t border-slate-700/50">
          
          <div className="flex flex-col space-y-2 flex-grow">
            <div className="flex flex-wrap gap-2">
              <SentimentBadge sentiment={item.ai_sentiment} />
              
          
              {item.ai_tags?.map(tag => (
                <Chip 
                  key={tag} 
                  label={tag} 
                  size="small" 
                  sx={{ 
                    backgroundColor: 'rgba(51, 65, 85, 0.4)', 
                    color: '#cbd5e1', 
                    height: '24px', 
                    fontSize: '11px',
                    border: '1px solid rgba(71, 85, 105, 0.5)'
                  }} 
                />
              ))}
            </div>
          </div>
          
          {/* Visual Priority representation */}
          <div className="w-full sm:w-32 flex-shrink-0">
            {item.ai_processed && item.ai_priority ? (
              <PriorityBar score={item.ai_priority} />
            ) : (
              <div className="flex items-center space-x-2 text-xs text-slate-500 h-full">
                <CircularProgress size={12} sx={{ color: '#64748b' }} />
                <span>AI Pending...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MUI Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundColor: '#1e293b', 
            border: '1px solid #334155',
            color: '#f1f5f9', 
            minWidth: '160px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
          }
        }}
      >
        <Typography variant="overline" sx={{ px: 2, pb: 1, display: 'block', color: '#94a3b8' }}>Update Status</Typography>
        <MenuItem onClick={() => handleStatusChange('New')} disabled={item.status === 'New'} sx={menuItemHover}>New</MenuItem>
        <MenuItem onClick={() => handleStatusChange('In Review')} disabled={item.status === 'In Review'} sx={menuItemHover}>In Review</MenuItem>
        <MenuItem onClick={() => handleStatusChange('Resolved')} disabled={item.status === 'Resolved'} sx={menuItemHover}>Resolved</MenuItem>
        
        <Box sx={{ my: 1, borderTop: '1px solid #334155' }} />
        
        <MenuItem onClick={handleReanalyzeClick} sx={{ color: '#818cf8', '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.1)' } }}>
          <MonitorPlay size={16} className="mr-2" /> Re-analyze AI
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); setDeleteDialogOpen(true); }} sx={{ color: '#ef4444', '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' } }}>
          <Trash2 size={16} className="mr-2" /> Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ color: 'white' }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#cbd5e1' }}>
            Are you sure you want to permanently delete "{item.title}"? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
          <Button 
            onClick={() => { onDelete(item._id); setDeleteDialogOpen(false); }} 
            variant="contained" 
            color="error"
            sx={{ flexShrink: 0 }}
          >
            Delete Permanently
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const menuItemHover = {
  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
};
