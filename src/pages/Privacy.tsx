import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-blue-200">
      <header className="absolute top-0 w-full p-6 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="container mx-auto px-4 max-w-4xl flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-1">
            <img src="/logo.svg" alt="E" className="w-6 h-6 drop-shadow-sm" />
            <span className="text-xl font-black tracking-tight text-foreground">xplein.</span>
          </div>
        </div>
      </header>

      <main className="flex-1 relative pt-32 pb-32">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 prose prose-blue max-w-none"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-8">Privacy Policy</h1>
            <p className="text-gray-500 mb-8">Last updated: March 20, 2026</p>

            <section className="mb-8 text-gray-700 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">1. Introduction</h2>
              <p>
                Welcome to Explein ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. By using Explein.xyz and our services, you trust us with your personal information. We take your privacy very seriously.
              </p>
            </section>

            <section className="mb-8 text-gray-700 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">2. Information We Collect</h2>
              <p>
                <strong>Personal Information:</strong> We collect personal information that you voluntarily provide to us when you register on initially accessing the platform, express an interest in obtaining information about us or our products, or otherwise contact us. This includes names, email addresses, and passwords.
              </p>
              <p>
                <strong>Usage Data:</strong> We automatically collect certain information when you visit, use, or navigate the platform. This data includes IP addresses, browser characteristics, device IDs, and interaction data regarding your flashcards and study notes (to better personalize your AI assistance).
              </p>
            </section>

            <section className="mb-8 text-gray-700 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">3. How We Use Your Information</h2>
              <p>We use personal information collected via our website for a variety of business purposes described below:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To facilitate account creation and logon processes.</li>
                <li>To provide the AI-powered learning services, generating custom flashcards and summaries.</li>
                <li>To process and manage your subscriptions and payments via Paystack.</li>
                <li>To respond to user inquiries and offer support.</li>
              </ul>
            </section>

            <section className="mb-8 text-gray-700 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">4. Sharing Your Information</h2>
              <p>
                We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We use trusted third-party service providers like Supabase for backend infrastructure and authentication, and Paystack for payment processing. 
              </p>
            </section>

            <section className="mb-8 text-gray-700 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">5. Data Retention & Security</h2>
              <p>
                We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required by law. We have implemented appropriate technical and organizational security measures via Supabase Row Level Security to protect the security of any personal information we process.
              </p>
            </section>

            <section className="mb-8 text-gray-700 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">6. Contact Us</h2>
              <p>
                If you have questions or comments about this notice, you may email us at privacy@explein.xyz or by post to our registered office.
              </p>
            </section>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
