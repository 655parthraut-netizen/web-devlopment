import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Key, Mail, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { setError(''); setLoading(true); await login(email, password); navigate('/profile'); }
    catch (err) { setError(err.message || 'Failed to sign in. Please verify your credentials.'); }
    finally { setLoading(false); }
  };

  const inputClasses = 'w-full bg-white border border-gray-200 text-gray-900 rounded-lg py-3 pl-11 pr-4 text-sm leading-normal focus:border-gray-900';

  return (
    <div className="page-shell min-h-[80vh] flex items-center justify-center py-16 px-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full p-8 rounded-xl border border-gray-100 bg-white text-left space-y-6 shadow-sm">
        <div className="text-center space-y-2">
          <span className="eyebrow mb-0">Sign in</span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">Welcome back</h1>
          <p className="text-sm text-gray-500 leading-relaxed">Access your cart, wishlist, and order history.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-red-100 bg-red-50 text-red-700 text-sm">
            <ShieldAlert className="h-4 w-4 flex-shrink-0" /><span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Email</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 h-4 w-4 text-gray-400" />
              <input type="email" required placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="label-text mb-0">Password</label>
              <a href="#" className="text-xs text-gray-600 hover:text-gray-900 transition-colors">Forgot password?</a>
            </div>
            <div className="relative flex items-center">
              <Key className="absolute left-4 h-4 w-4 text-gray-400" />
              <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClasses} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50 disabled:cursor-wait">
            {loading ? 'Signing in...' : <><LogIn className="h-4 w-4" /><span>Sign in</span></>}
          </button>
        </form>

        <div className="text-center pt-2 text-sm text-gray-500 border-t border-gray-100">
          <span>New here? </span>
          <Link to="/signup" className="text-gray-900 font-medium hover:underline">Create an account</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
