import React from 'react';
import FeedbackForm from '@/components/FeedbackForm';
import { Lightbulb, MessagesSquare, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 bg-[url('/bg-grid.svg')] bg-center relative overflow-hidden flex flex-col items-center justify-center p-4">
      
      <div className="absolute top-10 left-10 w-64 h-64 bg-teal-500/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">
        
        {/* Product Pitch*/}
        <div className="space-y-8">
          <div className="space-y-4">
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-teal-400 text-sm font-medium">
              <Zap size={14} className="text-amber-400" />
              <span>We're listening. Tell us what you need.</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              Help us build a <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">better product.</span>
            </h1>
            
            <p className="text-lg text-slate-400 leading-relaxed max-w-md">
              Your feedback shapes our roadmap. Whether it's a bug, a new idea, or an improvement, we want to hear it. Our AI instantly categorizes and prioritizes your requests.
            </p>
          </div>
          
          {/* Why it matters section */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="mt-1 p-2 bg-slate-800 rounded-lg text-teal-400 border border-slate-700">
                <MessagesSquare size={18} />
              </div>
              <div>
                <h3 className="text-slate-200 font-semibold">Instant Categorization</h3>
                <p className="text-slate-400 text-sm">We use Google Gemini AI to tag and organize your ideas the second you hit submit.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="mt-1 p-2 bg-slate-800 rounded-lg text-amber-400 border border-slate-700">
                <Lightbulb size={18} />
              </div>
              <div>
                <h3 className="text-slate-200 font-semibold">Priority Routing</h3>
                <p className="text-slate-400 text-sm">Critical bugs get sent straight to the engineering team. Feature requests go to product planning.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side: The Form Card */}
        <div className="w-full relative">
          {/* 
            Premium Glassmorphism Card 
            This fulfills the "WOW the user" design requirement
          */}
          <div className="glass-panel p-8 backdrop-blur-xl bg-slate-800/80 border border-slate-700 shadow-2xl rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Submit Feedback</h2>
            
            {/* The actual interactive form is an isolated Client Component */}
            <FeedbackForm />
            
            {/* Rate Limit Notice */}
            <div className="mt-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-xs text-amber-200">
                <span className="font-semibold">Rate Limit:</span> You can submit feedback up to 5 times per hour. Exceeding this limit will require waiting until the next hour.
              </p>
            </div>
          </div>
          
          {/* Admin link hidden quietly at the bottom for easy access */}
          <div className="mt-6 text-center">
            <a href="/login" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Team Login →
            </a>
          </div>
        </div>
        
      </div>
    </main>
  );
}
