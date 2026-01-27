import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutDashboard, 
  BookOpen, 
  Settings,
  GraduationCap,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin, isInstructor } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/programs', label: 'Programs' },
    { href: '/courses', label: 'Courses' },
    { href: '/about', label: 'About' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin';
    if (isInstructor) return '/instructor';
    return '/dashboard';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" data-testid="header-logo">
            <img 
              src="/images/logo.webp" 
              alt="Right Tech Centre" 
              className="h-8 md:h-10 w-auto"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <span className="font-bold text-lg md:text-xl tracking-tight hidden sm:block">
              Right Tech <span className="gradient-text">Centre</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                data-testid={`nav-${link.label.toLowerCase()}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.href
                    ? 'text-[#CCFF00]'
                    : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 text-white hover:bg-white/5"
                    data-testid="user-menu-trigger"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#CCFF00] flex items-center justify-center">
                      <span className="text-black font-bold text-sm">
                        {user?.full_name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden lg:block">{user?.full_name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-[#0A0A0A] border-[#27272A]"
                >
                  <div className="px-3 py-2 border-b border-[#27272A]">
                    <p className="text-sm font-medium text-white">{user?.full_name}</p>
                    <p className="text-xs text-[#A1A1AA]">{user?.email}</p>
                  </div>
                  <DropdownMenuItem 
                    onClick={() => navigate(getDashboardLink())}
                    className="cursor-pointer hover:bg-white/5"
                    data-testid="menu-dashboard"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate('/my-courses')}
                    className="cursor-pointer hover:bg-white/5"
                    data-testid="menu-my-courses"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    My Courses
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate('/certificates')}
                    className="cursor-pointer hover:bg-white/5"
                    data-testid="menu-certificates"
                  >
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Certificates
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#27272A]" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-red-400 hover:bg-white/5 hover:text-red-400"
                    data-testid="menu-logout"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white/5"
                    data-testid="login-btn"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    className="bg-[#CCFF00] text-black hover:bg-[#B3E600] rounded-full font-bold btn-glow"
                    data-testid="register-btn"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white"
            data-testid="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0A0A0A] border-t border-[#27272A]"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-medium ${
                    location.pathname === link.href
                      ? 'bg-[#CCFF00]/10 text-[#CCFF00]'
                      : 'text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-[#27272A] space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg text-white hover:bg-white/5"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-white/5"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg text-white hover:bg-white/5"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg bg-[#CCFF00] text-black font-bold text-center"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
