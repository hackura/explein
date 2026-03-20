
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="py-24 bg-blue-600 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Start Learning Smarter Today</h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Join thousands of students and professionals who are already accelerating their learning with Explein.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link to="/login" className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-xl w-full sm:w-auto text-lg flex items-center justify-center gap-2">
            Sign Up Now <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-colors w-full sm:w-auto text-lg flex items-center justify-center gap-2">
            Continue with Google
          </button>
        </div>
      </div>
    </section>
  );
}
