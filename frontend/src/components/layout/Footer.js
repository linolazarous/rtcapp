import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Youtube,
  ArrowRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const programLinks = [
    { label: 'Diploma Programs', href: '/programs?type=diploma' },
    { label: 'Bachelor Programs', href: '/programs?type=bachelor' },
    { label: 'Certifications', href: '/programs?type=certification' },
    { label: 'All Courses', href: '/courses' },
  ];

  const resourceLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Student Portal', href: '/dashboard' },
    { label: 'Certificate Verification', href: '/verify' },
    { label: 'AI Tutor', href: '/ai-tutor' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund Policy', href: '/refund' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-[#050505] border-t border-[#27272A]">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img 
                src="/images/logo.webp" 
                alt="Right Tech Centre" 
                className="h-10 w-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="font-bold text-xl tracking-tight">
                Right Tech <span className="gradient-text">Centre</span>
              </span>
            </Link>
            <p className="text-[#A1A1AA] text-sm mb-6 leading-relaxed">
              AI-Powered Tech Education Platform. Empowering tomorrow's innovators with cutting-edge education and training.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a 
                href="mailto:info@righttechcentre.com" 
                className="flex items-center gap-3 text-sm text-[#A1A1AA] hover:text-[#CCFF00] transition-colors"
              >
                <Mail className="w-4 h-4" />
                info@righttechcentre.com
              </a>
            </div>
          </div>

          {/* Programs Column */}
          <div>
            <h4 className="text-white font-bold mb-4">Programs</h4>
            <ul className="space-y-3">
              {programLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-sm text-[#A1A1AA] hover:text-[#CCFF00] transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-sm text-[#A1A1AA] hover:text-[#CCFF00] transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-white font-bold mb-4">Stay Updated</h4>
            <p className="text-sm text-[#A1A1AA] mb-4">
              Subscribe to our newsletter for the latest courses and tech insights.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-[#121212] border border-[#27272A] px-4 py-2 text-sm text-white placeholder:text-[#52525B] focus:border-[#CCFF00] focus:outline-none focus:ring-1 focus:ring-[#CCFF00]"
              />
              <button className="bg-[#CCFF00] text-black px-4 py-2 font-bold hover:bg-[#B3E600] transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 flex items-center justify-center bg-[#121212] border border-[#27272A] text-[#A1A1AA] hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#52525B]">
              © {currentYear} Right Tech Centre. All rights reserved.
            </p>
            <div className="flex gap-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm text-[#52525B] hover:text-[#A1A1AA] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
