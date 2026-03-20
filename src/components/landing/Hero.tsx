
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative pt-24 pb-32 overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>The next generation of AI learning</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6"
        >
          Master any subject, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">faster.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto"
        >
          Explein is your personal AI study assistant. It helps you understand complex topics, automatically generates flashcards, and tracks your progress as you learn.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/login" className="px-8 py-4 bg-foreground text-background font-medium rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg shadow-gray-200 block text-lg">
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="px-8 py-4 bg-white border-2 border-gray-200 text-foreground font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto block text-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 relative mx-auto max-w-5xl rounded-xl border border-gray-200/50 bg-white shadow-2xl overflow-hidden"
        >
          <img src="/dashboard.png" alt="Explein Dashboard Preview" className="w-full h-auto object-cover" />
        </motion.div>
      </div>
    </section>
  );
}
