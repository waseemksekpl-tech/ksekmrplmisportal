import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ShieldCheck, 
  Building2, 
  AlertCircle, 
  ArrowRight, 
  KeyRound, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const LoginView: React.FC = () => {
  const { loginWithEmail, resetPassword, switchDemoRole } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both your company email and password.');
      return;
    }
    setLoading(true);
    setErrorMessage('');

    const res = await loginWithEmail(email.trim(), password);
    setLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed. Please verify credentials or use quick-demo logins.');
    }
  };

  const handleQuickLogin = async (role: UserRole, demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('admin123');
    setLoading(true);
    setErrorMessage('');
    
    // Direct switch or login
    switchDemoRole(role);
    const res = await loginWithEmail(demoEmail, 'admin123');
    setLoading(false);
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    const res = await resetPassword(forgotEmail.trim());
    setForgotLoading(false);
    if (res.success) {
      setForgotSent(true);
    } else {
      setErrorMessage(res.error || 'Password reset failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Subtle Gradient & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-700 border border-slate-700 shadow-xl text-white font-black text-xl tracking-wider">
            KS
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            KS ENTERPRISES (KMR) PVT LTD
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 text-xs font-medium">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Apple Authorized Regional Distributor</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Private Internal Management Information System (MIS)
          </p>
        </div>

        {/* Card Box */}
        <div className="mt-8 bg-slate-800/90 backdrop-blur-md py-8 px-4 shadow-2xl border border-slate-700/80 sm:rounded-2xl sm:px-10">
          {errorMessage && (
            <div className="mb-5 p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="login-email">
                Company Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="employee@ksekpl.com"
                  className="block w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300" htmlFor="login-password">
                  Security Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] font-medium text-blue-400 hover:text-blue-300"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <button
              id="submit-login-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/20 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Sign In to MIS Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Role Logins */}
          <div className="mt-6 pt-5 border-t border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Quick-Test Demo Roles
              </span>
              <span className="text-[10px] text-slate-500">1-Click Login</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                id="demo-login-super-admin"
                onClick={() => handleQuickLogin('super_admin', 'waseemksekpl@gmail.com')}
                className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-900 border border-purple-500/30 hover:border-purple-500/60 text-left transition-all group cursor-pointer"
              >
                <div className="font-semibold text-purple-300 text-[11px] group-hover:text-purple-200">Super Admin</div>
                <div className="text-[10px] text-slate-400 truncate">waseemksekpl@gmail.com</div>
              </button>

              <button
                type="button"
                id="demo-login-mis-admin"
                onClick={() => handleQuickLogin('mis_admin', 'mis.admin@ksekpl.com')}
                className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-900 border border-blue-500/30 hover:border-blue-500/60 text-left transition-all group cursor-pointer"
              >
                <div className="font-semibold text-blue-300 text-[11px] group-hover:text-blue-200">MIS Admin</div>
                <div className="text-[10px] text-slate-400 truncate">mis.admin@ksekpl.com</div>
              </button>

              <button
                type="button"
                id="demo-login-manager"
                onClick={() => handleQuickLogin('manager', 'amit.kumar@ksekpl.com')}
                className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 text-left transition-all group cursor-pointer"
              >
                <div className="font-semibold text-emerald-300 text-[11px] group-hover:text-emerald-200">Operations Mgr</div>
                <div className="text-[10px] text-slate-400 truncate">amit.kumar@ksekpl.com</div>
              </button>

              <button
                type="button"
                id="demo-login-employee"
                onClick={() => handleQuickLogin('employee', 'priya.sharma@ksekpl.com')}
                className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-900 border border-slate-600 hover:border-slate-500 text-left transition-all group cursor-pointer"
              >
                <div className="font-semibold text-slate-300 text-[11px] group-hover:text-white">Field Employee</div>
                <div className="text-[10px] text-slate-400 truncate">priya.sharma@ksekpl.com</div>
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60 text-[10px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Private Corporate System. Unauthorized access attempts are monitored and recorded.</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-blue-400" />
              Reset Corporate Password
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your registered corporate email to receive a password reset link.
            </p>

            {forgotSent ? (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Reset link sent! Check your company inbox.</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setShowForgotModal(false); setForgotSent(false); }}
                  className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="your.email@ksekpl.com"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold disabled:opacity-50"
                  >
                    {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
