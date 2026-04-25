'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, CheckCircle, ShieldCheck, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

type Step = 'info' | 'otp' | 'password';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    otp: '',
    password: '',
    isVerified: false
  });

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!response.ok) throw new Error('Failed to send OTP');
      
      setStep('otp');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
      });

      if (!response.ok) throw new Error('Invalid or expired OTP');
      
      setFormData(prev => ({ ...prev, isVerified: true }));
      setStep('password');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      localStorage.setItem('user', JSON.stringify(data));
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        router.push('/');
      }
    } catch (err) {
      setError('Google login failed');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-600 mb-4 shadow-lg shadow-violet-600/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-50 tracking-tight">Create your account</h1>
          <p className="text-slate-400 mt-2 text-sm">Secure your financial future today</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl overflow-hidden relative">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 'info' && (
              <motion.form
                key="info"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                onSubmit={handleSendOTP}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-500 transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe"
                      className="w-full bg-slate-800/50 border border-slate-700 text-slate-50 text-sm rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-violet-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-500 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com"
                      className="w-full bg-slate-800/50 border border-slate-700 text-slate-50 text-sm rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-violet-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Sending...' : 'Verify Email'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500 font-bold">Or continue with</span></div>
                </div>

                <div className="flex justify-center">
                  <GoogleLogin onSuccess={handleGoogleSuccess} theme="filled_black" shape="pill" />
                </div>
              </motion.form>
            )}

            {step === 'otp' && (
              <motion.form
                key="otp"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                onSubmit={handleVerifyOTP}
                className="space-y-6 text-center"
              >
                <div>
                  <div className="w-12 h-12 rounded-full bg-violet-600/20 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-violet-500" />
                  </div>
                  <h3 className="text-slate-50 font-bold">Verify your email</h3>
                  <p className="text-slate-400 text-xs mt-1">We sent a 6-digit code to {formData.email}</p>
                </div>

                <input
                  required
                  type="text"
                  maxLength={6}
                  value={formData.otp}
                  onChange={(e) => setFormData({...formData, otp: e.target.value})}
                  placeholder="000000"
                  className="w-full bg-slate-800/50 border border-slate-700 text-slate-50 text-2xl font-bold tracking-[1em] text-center rounded-xl py-4 focus:ring-2 focus:ring-violet-500/50 outline-none transition-all"
                />

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all"
                  >
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                  </button>
                  <button type="button" onClick={() => setStep('info')} className="text-slate-500 text-xs font-bold hover:text-slate-300">Change Email</button>
                </div>
              </motion.form>
            )}

            {step === 'password' && (
              <motion.form
                key="password"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                onSubmit={handleRegister}
                className="space-y-5"
              >
                <div className="text-center mb-4">
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <h3 className="text-slate-50 font-bold">Email Verified!</h3>
                  <p className="text-slate-400 text-xs">Now create a strong password</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-500 transition-colors">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      required
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••"
                      className="w-full bg-slate-800/50 border border-slate-700 text-slate-50 text-sm rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-violet-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all"
                >
                  {isLoading ? 'Creating...' : 'Complete Registration'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-8 text-center text-slate-400 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-violet-400 font-bold hover:text-violet-300 transition-colors">Log In</Link>
        </p>
      </motion.div>
    </div>
  );
}
