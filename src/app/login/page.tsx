"use client";

import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { LogIn, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Quick client validation
    if (!formData.email || !formData.password) {
      toast.error("Both fields are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/auth/login", formData);
      const { token } = response.data.data;

      document.cookie = `admin_token=${token}; path=/; max-age=86400; SameSite=Strict;`;

      toast.success("Welcome back, Admin!");

      router.push("/dashboard");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Login failed. Try again.";
      toast.error(msg);

      // Clear password field on failure but keep email
      setFormData((prev) => ({ ...prev, password: "" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -z-10" />

      {/* Back button */}
      <div className="absolute top-8 left-8">
        <a
          href="/"
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Back to Form</span>
        </a>
      </div>

      {/* Login Card Container */}
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-teal-400 mb-4 shadow-lg">
            <LogIn size={24} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Team Login</h1>
          <p className="text-slate-400">Access the FeedPulse dashboard</p>
        </div>

        {/* Glassmorphism Panel */}
        <div className="glass-panel p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <TextField
              fullWidth
              type="email"
              name="email"
              label="Admin Email"
              variant="filled"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              autoComplete="email"
              autoFocus
              sx={inputStyles}
            />

            <TextField
              fullWidth
              type="password"
              name="password"
              label="Password"
              variant="filled"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              autoComplete="current-password"
              sx={inputStyles}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isSubmitting || !formData.email || !formData.password}
              sx={{
                py: 1.5,
                mt: 2,
                backgroundColor: "#6366f1", // Indigo 500 for admin
                "&:hover": { backgroundColor: "#4f46e5" },
                "&:disabled": { backgroundColor: "#334155", color: "#64748b" },
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center space-x-2">
                  <CircularProgress size={20} color="inherit" />
                  <span>Authenticating...</span>
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700/50 text-center space-y-2">
            <p className="text-xs text-slate-500">For testing purposes, try:</p>
            <p className="text-xs text-slate-400 font-mono bg-slate-800/50 py-2 inline-block px-4 rounded-lg border border-slate-700">
              admin@feedpulse.com / Admin@123
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

const inputStyles = {
  "& .MuiFilledInput-root": {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: "8px",
    border: "1px solid rgba(51, 65, 85, 0.6)",
    transition: "all 0.2s",
    "&:hover": { backgroundColor: "rgba(30, 41, 59, 0.8)" },
    "&.Mui-focused": {
      backgroundColor: "rgba(15, 23, 42, 0.8)",
      borderColor: "#6366f1",
      boxShadow: "0 0 0 1px #6366f1",
    },
    "&:before, &:after": { display: "none" },
  },
  "& .MuiInputLabel-root": {
    color: "#94a3b8",
    "&.Mui-focused": { color: "#818cf8" },
  },
  "& .MuiInputBase-input": { color: "#f8fafc" },
};
