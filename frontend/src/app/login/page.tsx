'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: tokenResponse.access_token }),
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data);
          router.push('/');
        }
      } catch (err) {
        setError('Google login failed');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setError('Google Login Failed'),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      setUser(data);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gray-950 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px]"
      >
        <div className="text-center mb-10 space-y-3">
          <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/20 rotate-3">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Welcome Back</h1>
          <p className="text-white/60 font-bold tracking-tight">Enter your credentials to access <span className="text-primary font-black">Ascentia</span></p>
        </div>

        <div className="horizon-card p-10 bg-slate-900 border-white/5 space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-600 shadow-glow" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="horizon-input !pl-14 bg-slate-800 text-white border-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Password</label>
                <Link href="#" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Forgot password?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="horizon-input !pl-14 bg-slate-800 text-white border-white/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="horizon-btn-primary w-full h-16 text-sm uppercase tracking-widest mt-4"
            >
              {isLoading ? 'Processing...' : 'Sign In'}
              {!isLoading && <ArrowRight className="w-5 h-5 ml-1" />}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]"><span className="bg-slate-900 px-4 text-white/30 font-black">Secure Authentication</span></div>
          </div>

          <button 
            onClick={() => googleLogin()}
            disabled={isLoading}
            className="w-full h-16 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center gap-4 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all shadow-sm group disabled:opacity-50"
          >
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.68 4.79 1.97l3.58-3.58C18.16 1.28 15.3 0 12 0 7.31 0 3.25 2.69 1.19 6.6L5.3 9.8c1-3.02 3.8-5.24 6.7-5.24z"/>
              <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.7 2.88c2.16-1.99 3.42-4.93 3.42-8.7z"/>
              <path fill="#34A853" d="M5.3 14.2c-.26-.79-.41-1.63-.41-2.5s.15-1.71.41-2.5L1.19 6.6C.43 8.22 0 10.06 0 12s.43 3.78 1.19 5.4l4.11-3.2z"/>
              <path fill="#FBBC05" d="M12 18.96c-2.9 0-5.7-2.22-6.7-5.24l-4.11 3.2C3.25 21.31 7.31 24 12 24c3.3 0 6.07-1.07 8.08-2.9l-3.7-2.88c-1.12.74-2.54 1.14-4.38 1.14z"/>
            </svg>
            <span className="text-sm font-black text-white tracking-tight">Continue with Google</span>
          </button>
        </div>

        <p className="mt-10 text-center text-slate-500 font-bold text-sm">
          New to Ascentia?{' '}
          <Link href="/register" className="text-primary hover:underline underline-offset-4 decoration-2">Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
}
