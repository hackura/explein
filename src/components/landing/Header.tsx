import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '/pricing' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm py-4'
          : 'bg-transparent py-6'
        }`}
    >
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 z-50">
          <img src="/logo.svg" alt="E" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm transition-transform hover:scale-105" />
          <span className="text-xl md:text-2xl font-black tracking-tight text-foreground">xplein.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 bg-white/50 backdrop-blur-lg px-6 py-2.5 rounded-full border border-gray-200/50 shadow-sm">
          {navLinks.map((link) => (
            link.href.startsWith('/') ? (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-medium text-gray-600 hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            )
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="text-sm font-medium bg-foreground text-background px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-foreground transition-colors px-2"
              >
                Sign in
              </Link>
              <Link
                to="/login"
                className="text-sm font-medium bg-foreground text-background px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden z-50 p-2 -mr-2 text-gray-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-xl pt-24 pb-8 px-4 flex flex-col gap-6 md:hidden"
            >
              <nav className="flex flex-col gap-4 text-center">
                {navLinks.map((link) => (
                  link.href.startsWith('/') ? (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium text-gray-600 hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium text-gray-600 hover:text-foreground"
                    >
                      {link.name}
                    </a>
                  )
                ))}
              </nav>
              <div className="flex flex-col gap-3 mt-4 pt-6 border-t border-gray-100">
                {user ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 text-center font-medium bg-foreground text-background rounded-xl shadow-md"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 text-center font-medium border border-gray-200 rounded-xl"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 text-center font-medium bg-foreground text-background rounded-xl shadow-md"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
