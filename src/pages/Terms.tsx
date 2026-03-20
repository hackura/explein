import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
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
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-8">Terms of Use</h1>
            <p className="text-gray-500 mb-8">Last updated: March 20, 2026</p>

            <section className="mb-8 text-gray-700 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">1. Agreement to Terms</h2>
              <p>
                By accessing Explein.xyz or utilizing our AI-powered study assistance software, you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, you are prohibited from using this site.
              </p>
            </section>

            <section className="mb-8 text-gray-700 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">2. Description of Service</h2>
              <p>
                Explein provides machine-learning accelerated study tools. We grant you a limited, non-exclusive, non-transferable, and revocable license to use our Services for personal, non-commercial educational purposes, subject to these terms.
              </p>
            </section>

            <section className="mb-8 text-gray-700 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">3. User Accounts & Subscriptions</h2>
              <p>
                To access advanced generation features, you must subscribe to our Pro tier. Payment processing is facilitated securely by Paystack. You are responsible for maintaining the confidentiality of your account credentials. We reserve the right to suspend or terminate accounts that violate our terms or exploit platform infrastructure.
              </p>
            </section>

            <section className="mb-8 text-gray-700 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">4. Prohibited Activities</h2>
              <p>You may not access or use the platform for any purpose other than that for which we make the site available. You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Systematically retrieve data or content to create or compile a database without written permission.</li>
                <li>Trick, defraud, or mislead us or other users.</li>
                <li>Circumvent, disable, or interfere with security-related features.</li>
                <li>Automate interactions with the platform (e.g. bots, scraping) to mass-generate AI content.</li>
                <li>Sell, resell, or rent out access to your account.</li>
              </ul>
            </section>

            <section className="mb-8 text-gray-700 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">5. Limitation of Liability</h2>
              <p>
                The AI tools are provided for supplementary educational purposes. We do not guarantee the absolute factual accuracy of AI-generated notes or flashcards. In no event will Explein or its directors be liable to you for any direct, indirect, consequential, or incidental damages arising from your use of the site.
              </p>
            </section>

            <section className="mb-8 text-gray-700 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">6. Modifications</h2>
              <p>
                We may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then-current version of these terms.
              </p>
            </section>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
