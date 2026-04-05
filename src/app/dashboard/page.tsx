'use client';


import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  CircularProgress, AppBar, Toolbar, Typography, Button, 
  Menu, MenuItem, IconButton, InputBase, Select, FormControl, InputLabel,
  Pagination, Box
} from '@mui/material';
import { LogOut, Filter, ArrowUpDown, Search, RefreshCw, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Import our custom components
import StatsBar from '@/components/StatsBar';
import AIInsightPanel from '@/components/AIInsightPanel';
import FeedbackCard, { FeedbackItem } from '@/components/FeedbackCard';

export default function DashboardPage() {
  const router = useRouter();

  // ---- Data State ----
  const [stats, setStats] = useState<any>(null);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [aiSummary, setAiSummary] = useState<{ text: string | null; loading: boolean }>({ text: null, loading: false });
  
  // ---- Pagination State ----
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // ---- Filter & Sort State ----
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // ---- Loading States ----
  const [initialLoad, setInitialLoad] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  
  const fetchDashboardData = useCallback(async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setIsRefreshing(true);
    
    try {
      // 1. Fetch Stats
      const statsRes = await api.get('/feedback/stats');
      setStats(statsRes.data.data);

      // Fetch Feedback List 
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        sort: sortField,
        order: sortOrder,
        ...(statusFilter && { status: statusFilter }),
        ...(categoryFilter && { category: categoryFilter }),
        ...(search && { search }),
      });

      const listRes = await api.get(`/feedback?${queryParams.toString()}`);
      setFeedback(listRes.data.data);
      setTotalPages(listRes.data.pagination.totalPages || 1);
      
    } catch (error: any) {
      console.error('Dashboard fetch error:', error);
      toast.error('Failed to load dashboard data.');
    } finally {
      if (showRefreshIndicator) setIsRefreshing(false);
      setInitialLoad(false);
    }
  }, [page, sortField, sortOrder, statusFilter, categoryFilter, search]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);


  const fetchWeeklySummary = async () => {
    setAiSummary(prev => ({ ...prev, loading: true }));
    try {
      const res = await api.get('/feedback/summary');
      setAiSummary({ text: res.data.data.summary, loading: false });
    } catch (err) {
      toast.error('Failed to generate AI weekly summary');
      setAiSummary(prev => ({ ...prev, loading: false }));
    }
  };

  // ACTION HANDLERS

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/feedback/${id}`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      // Refresh list to show change immediately
      fetchDashboardData(); 
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleReanalyze = async (id: string) => {
    try {
      await api.patch(`/feedback/${id}/reanalyze`);
      toast.success('AI Re-analysis started...', { icon: '🤖' });


      let pollAttempts = 0;
      const maxAttempts = 30; 
      const pollInterval = 1500; 

      const pollForCompletion = async () => {
        while (pollAttempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, pollInterval));
          pollAttempts++;

          try {
            const res = await api.get(`/feedback/${id}`);
            const item = res.data.data;

      
            if (item.ai_processed) {
              fetchDashboardData(); 
              toast.success('AI analysis complete!', { icon: '✨' });
              return;
            }
          } catch (pollErr) {
            console.error('Poll error:', pollErr);
           
          }
        }

        // If we've polled 30 times and still not done, give up
        toast.error('AI analysis took too long. Please refresh manually.');
      };

      
      pollForCompletion();
    } catch (err) {
      toast.error('Failed to start re-analysis');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/feedback/${id}`);
      toast.success('Feedback permanently deleted');
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to delete feedback');
    }
  };

  const handleLogout = () => {
    document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  const clearFilters = () => {
    setStatusFilter('');
    setCategoryFilter('');
    setSearch('');
    setPage(1);
  };

  // VIEW RENDERING

  if (initialLoad) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <CircularProgress size={48} sx={{ color: '#14b8a6', mb: 4 }} />
        <h2 className="text-xl font-semibold text-slate-300 animate-pulse">Loading FeedPulse Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-dark pb-20">
      
      {/* 
        Top Navigation Bar 
      */}
      <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(51, 65, 85, 0.5)' }}>
        <Toolbar className="flex justify-between max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center space-x-2">
             <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold"><Zap size={20} /></div>
             <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', display: { xs: 'none', sm: 'block' } }}>
               FeedPulse
             </Typography>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-md mx-4 relative hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-500" />
            </div>
            <InputBase
              placeholder="Search title or AI summary..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setPage(1)} 
              fullWidth
              sx={{ 
                pl: 5, pr: 2, py: 0.75, 
                backgroundColor: 'rgba(30, 41, 59, 0.5)', 
                borderRadius: '8px',
                color: 'white',
                border: '1px solid rgba(51, 65, 85, 0.5)',
                '&:focus-within': { borderColor: '#14b8a6', backgroundColor: 'rgba(15, 23, 42, 0.8)' }
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
             <Button 
               variant="outlined" 
               color="inherit" 
               startIcon={<RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />} 
               onClick={() => fetchDashboardData(true)}
               sx={{ borderColor: 'rgba(148, 163, 184, 0.3)', color: '#cbd5e1', display: { xs: 'none', md: 'flex' } }}
             >
               Refresh
             </Button>
             
             <IconButton onClick={handleLogout} sx={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.2)' } }} title="Logout">
               <LogOut size={18} />
             </IconButton>
          </div>
          
        </Toolbar>
      </AppBar>

      {/* Main Dashboard Content wrapper */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        
        {/* Requirement 3.8: Stats bar at the top */}
        {stats && (
          <StatsBar 
            total={stats.total} 
            openItems={stats.openItems} 
            avgPriority={stats.avgPriority} 
            topTag={stats.topTag} 
          />
        )}


        <div className="mb-8">
          <AIInsightPanel 
            summary={aiSummary.text} 
            loading={aiSummary.loading} 
            onRefresh={fetchWeeklySummary} 
          />
        </div>

        {/* List Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 space-y-4 md:space-y-0">
          
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-white">Feedback Items</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
              {stats?.total || 0} Total
            </span>
          </div>

          {/* Filters Control Group */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
             
             {/* Filter Status */}
             <FormControl size="small" sx={{ minWidth: 120 }}>
               <select 
                 value={statusFilter}
                 onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                 className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 outline-none"
               >
                 <option value="">All Statuses</option>
                 <option value="New">New</option>
                 <option value="In Review">In Review</option>
                 <option value="Resolved">Resolved</option>
               </select>
             </FormControl>

             {/* Filter Category */}
             <FormControl size="small" sx={{ minWidth: 140 }}>
               <select 
                 value={categoryFilter}
                 onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                 className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 outline-none"
               >
                 <option value="">All Categories</option>
                 <option value="Bug">Bug</option>
                 <option value="Feature Request">Feature Request</option>
                 <option value="Improvement">Improvement</option>
                 <option value="Other">Other</option>
               </select>
             </FormControl>

             {/* Sort Select */}
             <FormControl size="small" sx={{ minWidth: 150 }}>
               <select 
                 value={`${sortField}|${sortOrder}`} // Encode both into one value
                 onChange={(e) => {
                   const [field, order] = e.target.value.split('|');
                   setSortField(field);
                   setSortOrder(order as 'asc' | 'desc');
                   setPage(1);
                 }}
                 className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 outline-none"
               >
                 <option value="createdAt|desc">Newest First</option>
                 <option value="createdAt|asc">Oldest First</option>
                 <option value="ai_priority|desc">Priority (High to Low)</option>
                 <option value="ai_priority|asc">Priority (Low to High)</option>
               </select>
             </FormControl>

             {(statusFilter || categoryFilter || search) && (
               <Button size="small" color="inherit" onClick={clearFilters} sx={{ color: '#94a3b8' }}>
                 Clear
               </Button>
             )}
          </div>
        </div>

        {/* Mobile Search - visible only on small screens */}
        <div className="block sm:hidden mb-6 relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Search mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setPage(1)}
              className="pl-10 p-2.5 w-full bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
        </div>

        {/* 
          The Feedback List Grid 
        */}
        {feedback.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {feedback.map((item) => (
              <FeedbackCard 
                key={item._id} 
                item={item} 
                onUpdateStatus={handleUpdateStatus} 
                onReanalyze={handleReanalyze}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          /* Empty State Differentiator */
          <div className="glass-panel py-16 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-700 bg-slate-800/20">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4 border border-slate-700">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No feedback found</h3>
            <p className="text-slate-400 max-w-sm mb-6">
              Try adjusting your filters or search query to find what you're looking for.
            </p>
            <Button variant="outlined" onClick={clearFilters} sx={{ borderColor: '#475569', color: '#cbd5e1' }}>
              Clear all filters
            </Button>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={(_e, value) => {
                setPage(value);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              color="primary" 
              sx={{
                '& .MuiPaginationItem-root': { color: '#cbd5e1', borderColor: 'rgba(51, 65, 85, 0.5)' },
                '& .Mui-selected': { backgroundColor: 'rgba(20, 184, 166, 0.2) !important', color: '#14b8a6', border: '1px solid #14b8a6' },
                '& .MuiPaginationItem-icon': { color: '#cbd5e1' }
              }}
              variant="outlined" 
              shape="rounded"
            />
          </div>
        )}
        
      </main>
    </div>
  );
}
