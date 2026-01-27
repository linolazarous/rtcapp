import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const from = location.state?.from || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-20 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#0A0A0A] border border-[#27272A] p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <img 
                src="/images/logo.webp" 
                alt="Right Tech Centre" 
                className="h-12 w-auto mx-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </Link>
            <h1 className="text-2xl font-black text-white">Welcome Back</h1>
            <p className="text-[#A1A1AA] text-sm mt-2">Sign in to continue your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-[#121212] border-[#27272A] text-white placeholder:text-[#52525B] h-12"
                required
                data-testid="login-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-[#121212] border-[#27272A] text-white placeholder:text-[#52525B] h-12 pr-12"
                  required
                  data-testid="login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#CCFF00] text-black hover:bg-[#B3E600] font-bold h-12"
              data-testid="login-submit"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#A1A1AA] text-sm">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-[#CCFF00] hover:underline font-medium"
                data-testid="register-link"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 bg-[#121212] border border-[#27272A]">
            <p className="text-xs text-[#52525B] text-center">
              Demo: admin@righttechcentre.com / admin123
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
