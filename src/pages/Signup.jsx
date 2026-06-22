import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Key, Mail, User, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters long.'); return; }
    try { setError(''); setLoading(true); await signUp(email, password, fullName); navigate('/profile'); }
    catch (err) { setError(err.message || 'Registration failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const inputClasses = 'w-full bg-white border border-gray-200 text-gray-900 rounded-lg py-3 pl-11 pr-4 text-sm leading-normal focus:border-gray-900';

  return (
    <div className="page-shell min-h-[80vh] flex items-center justify-center py-16 px-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full p-8 rounded-xl border border-gray-100 bg-white text-left space-y-6 shadow-sm">
        <div className="text-center space-y-2">
          <span className="eyebrow mb-0">Create account</span>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">Join ElectroNova</h1>
          <p className="text-sm text-gray-500 leading-relaxed">Track orders, save wishlists, and checkout faster.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-red-100 bg-red-50 text-red-700 text-sm">
            <ShieldAlert className="h-4 w-4 flex-shrink-0" /><span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Full name</label>
            <div className="relative flex items-center">
              <User className="absolute left-4 h-4 w-4 text-gray-400" />
              <input type="text" required placeholder="Your name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClasses} />
            </div>
          </div>
          <div>
            <label className="label-text">Email</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 h-4 w-4 text-gray-400" />
              <input type="email" required placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} />
            </div>
          </div>
          <div>
            <label className="label-text">Password</label>
            <div className="relative flex items-center">
              <Key className="absolute left-4 h-4 w-4 text-gray-400" />
              <input type="password" required placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClasses} />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50 disabled:cursor-wait">
            {loading ? 'Creating account...' : <><UserPlus className="h-4 w-4" /><span>Create account</span></>}
          </button>
        </form>

        <div className="text-center pt-2 text-sm text-gray-500 border-t border-gray-100">
          <span>Already have an account? </span>
          <Link to="/login" className="text-gray-900 font-medium hover:underline">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
