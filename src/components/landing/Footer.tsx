import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-12 border-t border-gray-200">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center gap-1">
              <img src="/logo.svg" alt="E" className="w-8 h-8 drop-shadow-sm transition-transform hover:scale-105" />
              <span className="text-2xl font-black text-foreground tracking-tighter">xplein.</span>
            </div>
            <p className="text-gray-500 mt-2 text-sm">The intelligent AI learning platform.</p>
          </div>
          
          <div className="flex gap-8">
            <Link to="/pricing" className="text-gray-500 hover:text-foreground transition-colors font-medium text-blue-600">Pricing</Link>
            <a href="#" className="text-gray-500 hover:text-foreground transition-colors font-medium">About</a>
            <Link to="/privacy" className="text-gray-500 hover:text-foreground transition-colors font-medium">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-foreground transition-colors font-medium">Terms</Link>
            <a href="#" className="text-gray-500 hover:text-foreground transition-colors font-medium">Contact</a>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 text-center md:text-left text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Explein Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
