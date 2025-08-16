import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../api';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { useEffect } from 'react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthed, handleLogin } = useAuth();
  const { showSuccess, showError } = useToast();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthed) {
      const from = location.state?.from?.pathname || '/app';
      navigate(from, { replace: true });
    }
  }, [isAuthed, navigate, location]);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get('email');
    const password = form.get('password');
    
    try {
      const data = await login(email, password);
      
      // Use the new handleLogin function for instant state updates
      handleLogin(data.token, data.user);
      
      showSuccess('Login successful! Welcome back!');
      
      // Redirect to intended page or default to app
      const from = location.state?.from?.pathname || '/app';
      navigate(from, { replace: true });
    } catch (err) {
      showError(err.message || 'Please check your credentials');
    }
  }

  // Don't render if already authenticated
  if (isAuthed) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#0b0b0c] text-zinc-200 px-4 pt-20 lg:pt-28 xl:pt-32 pb-10">
      <div className="mx-auto max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-zinc-400">Log in to access your workspace</p>
        </div>

        <div className="rounded-2xl p-[1px] bg-gradient-to-br from-cyan-400/40 via-indigo-400/40 to-blue-500/40">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400">Email</label>
                <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-indigo-400" placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-xs text-zinc-400">Password</label>
                <input name="password" type="password" required className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-indigo-400" placeholder="••••••••" />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-zinc-400">
                  <input type="checkbox" className="h-4 w-4 rounded border-white/10 bg-white/5" />
                  Remember me
                </label>
                <a className="text-xs text-indigo-300 hover:text-indigo-200" href="#">Forgot password?</a>
              </div>
              <button type="submit" className="w-full rounded-lg border border-indigo-400 bg-indigo-600/80 px-4 py-2 text-sm text-white hover:bg-indigo-600">Log in</button>
            </div>
            <div className="mt-4 text-center text-sm text-zinc-400">
              New here? <Link to="/signup" className="text-indigo-300 hover:text-indigo-200">Create an account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

