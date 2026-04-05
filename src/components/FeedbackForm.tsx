'use client'; // This is an interactive Client Component

/**
 * FeedbackForm
 *
 * This handles the main user submission flow.
 * It features local validation, a character counter, loading states,
 * and a custom success screen that shows the user the AI's instant tagging.
 */

import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  MenuItem, 
  CircularProgress,
  Chip
} from '@mui/material';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

// Allowed categories matching the backend Enum
const CATEGORIES = ['Bug', 'Feature Request', 'Improvement', 'Other'];

export default function FeedbackForm() {
  // ---- Hydration State ----
  // Suppress hydration warnings from browser extensions adding attributes like fdprocessedid
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // ---- Form State ----
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Feature Request', // Default category
    name: '',
    email: '',
  });

  // ---- UI State ----
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // We store the submitted feedback data so we can show AI tags on the success screen
  const [submittedData, setSubmittedData] = useState<any>(null);

  // Character counter for the description requirement (Requirement 1.6: Nice to Have)
  const descLength = formData.description.length;
  const isDescValid = descLength >= 20;

  // Generic change handler for text inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Main submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation: title exists, desc >= 20 chars
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!isDescValid) {
      toast.error('Description must be at least 20 characters');
      return;
    }

    setIsSubmitting(true);
    
    // We wrap this in a customized toast.promise
    // It automatically shows "Submitting...", then Success, or Error based on the API result
    try {
      const response = await api.post('/feedback', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        submitterName: formData.name,
        submitterEmail: formData.email,
      });

      // Save the API response data so we can display it on the success screen
      setSubmittedData(response.data.data);
      
      // We don't use toast.success here because we show the big success screen instead
      toast('Feedback submitted successfully!', {
        icon: '🚀',
        style: { background: '#1e293b', color: '#fff' }
      });
      
      setIsSuccess(true);
      
    } catch (error: any) {
      console.error('Submission error:', error);
      
      // If it's a 429 rate limit error, show the backend message
      if (error.response?.status === 429) {
        const rateLimitMessage = error.response?.data?.message || 'You have submitted too much feedback. Please wait 1 hour before submitting again.';
        toast.error(rateLimitMessage);
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit feedback. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', category: 'Feature Request', name: '', email: '' });
    setIsSuccess(false);
    setSubmittedData(null);
  };

  // ==========================================
  // VIEW: SUCCESS SCREEN
  // This is a major differentiator. Instead of just a toast,
  // we give the user immediate feedback that their ideas are being processed.
  // ==========================================
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center text-teal-400">
          <CheckCircle2 size={32} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">Feedback received!</h3>
          <p className="text-slate-400 max-w-sm">
            Thank you for helping us improve. Our AI is currently analyzing your submission and routing it to the correct team.
          </p>
        </div>

        {/* 
          Feature: "Show AI tags back to submitter"
          Since AI runs asynchronously on the backend, we show an 'Analyzing...' state here.
          If we used a WebSocket this would update live, but for REST API we tell the user what's happening.
        */}
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 w-full mb-4">
          <div className="flex items-center space-x-2 text-indigo-400 font-medium mb-3">
            <Sparkles size={16} />
            <span className="text-sm">Gemini AI Analysis Started</span>
          </div>
          <div className="text-left text-sm text-slate-500 space-y-2">
            <p>ID: <span className="text-slate-300 font-mono">{submittedData?.id || 'Processing...'}</span></p>
            <p>Category: <span className="text-slate-300">{submittedData?.category || 'Routing...'}</span></p>
            <div className="h-1 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full w-full animate-pulse" />
            </div>
          </div>
        </div>

        <Button 
          variant="outlined" 
          onClick={resetForm}
          sx={{ borderColor: '#334155', color: '#94a3b8', '&:hover': { borderColor: '#475569', backgroundColor: 'transparent' } }}
        >
          Submit another idea
        </Button>
      </div>
    );
  }

  // ==========================================
  // VIEW: SUBMISSION FORM
  // ==========================================
  
  // Avoid hydration mismatch by only rendering after component mounts
  if (!isMounted) {
    return <div className="space-y-5 h-96" />; // Empty placeholder during SSR
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-300">
      
      {/* Category Dropdown */}
      <TextField
        select
        fullWidth
        name="category"
        label="What kind of feedback is this?"
        value={formData.category}
        onChange={handleChange}
        disabled={isSubmitting}
        variant="filled" // Filled variant looks best in dark mode
        sx={inputStyles}
        suppressHydrationWarning
      >
        {CATEGORIES.map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>

      {/* Title Input */}
      <TextField
        fullWidth
        name="title"
        label="Short, descriptive title"
        placeholder="e.g. Add dark mode to the dashboard"
        value={formData.title}
        onChange={handleChange}
        disabled={isSubmitting}
        required
        inputProps={{ maxLength: 120 }}
        variant="filled"
        sx={inputStyles}
        suppressHydrationWarning
      />

      {/* Description Textarea with Character Counter */}
      <div className="relative">
        <TextField
          fullWidth
          multiline
          rows={4}
          name="description"
          label="Please provide details"
          placeholder="What were you trying to do? What happened? What did you expect?"
          value={formData.description}
          onChange={handleChange}
          disabled={isSubmitting}
          required
          variant="filled"
          suppressHydrationWarning
          sx={{
            ...inputStyles,
            // If invalid length, change border color to warn user
            '& .MuiFilledInput-root': {
              ...inputStyles['& .MuiFilledInput-root'],
              borderBottomColor: (!isDescValid && descLength > 0) ? '#ef4444' : 'transparent',
            }
          }}
        />
        
        {/* Requirement 1.6: Character Counter on Description */}
        <div className={`absolute bottom-2 right-3 text-xs flex items-center space-x-1 transition-colors ${
          descLength === 0 ? 'text-slate-500' : 
          !isDescValid ? 'text-rose-400 font-medium' : 'text-teal-400'
        }`}>
          {!isDescValid && descLength > 0 && <AlertCircle size={10} />}
          <span>{descLength} / 20 min</span>
        </div>
      </div>

      {/* Optional Contact Info Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-700/50 mt-2">
        <TextField
          fullWidth
          name="name"
          label="Your name (optional)"
          value={formData.name}
          onChange={handleChange}
          disabled={isSubmitting}
          variant="filled"
          sx={inputStyles}
          suppressHydrationWarning
        />
        
        <TextField
          fullWidth
          type="email"
          name="email"
          label="Email (optional)"
          placeholder="For follow-up questions"
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
          variant="filled"
          sx={inputStyles}
          suppressHydrationWarning
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isSubmitting || !formData.title.trim() || !isDescValid}
        size="large"
        sx={{
          py: 1.5,
          mt: 2,
          backgroundColor: '#14b8a6', // Teal 500
          '&:hover': { backgroundColor: '#0f766e' },
          '&:disabled': { backgroundColor: '#334155', color: '#64748b' }
        }}
      >
        {isSubmitting ? (
          <span className="flex items-center space-x-2">
            <CircularProgress size={20} color="inherit" />
            <span>Sending to AI...</span>
          </span>
        ) : (
          'Submit Feedback'
        )}
      </Button>

    </form>
  );
}

// ----------------------------------------------------
// UI CONSTANTS — Customizing MUI for a modern "Glass" look
// ----------------------------------------------------
const inputStyles = {
  // Target the container
  '& .MuiFilledInput-root': {
    backgroundColor: 'rgba(30, 41, 59, 0.4)', // Slate-800 translucent
    borderRadius: '8px',
    border: '1px solid rgba(51, 65, 85, 0.6)', // Slate-700 border
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: 'rgba(30, 41, 59, 0.6)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(15, 23, 42, 0.8)', // Darker on focus
      borderColor: '#14b8a6', // Teal border on focus
      boxShadow: '0 0 0 1px #14b8a6',
    },
    // Hide the default underline animation in MUI
    '&:before, &:after': {
      display: 'none',
    },
  },
  // Target the label
  '& .MuiInputLabel-root': {
    color: '#94a3b8', // Slate-400
    '&.Mui-focused': {
      color: '#2dd4bf', // Teal-400
    },
  },
  // Target the input text
  '& .MuiInputBase-input': {
    color: '#f8fafc', // Slate-50
  },
  // Target dropdown icon
  '& .MuiSvgIcon-root': {
    color: '#94a3b8',
  }
};
