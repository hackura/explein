
import { motion } from 'framer-motion';

export default function DemoPreview() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">See Explein in Action</h2>
          <p className="text-xl text-gray-500">A sneak peek into your future study assistant.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors cursor-default"
            >
              <h3 className="text-xl font-bold text-foreground mb-2">Interactive Chat Interface</h3>
              <p className="text-gray-600">Ask any question and get instant, detailed, and context-aware responses designed specifically for learning, not just answers.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-colors cursor-default"
            >
              <h3 className="text-xl font-bold text-foreground mb-2">Smart Flashcard Studio</h3>
              <p className="text-gray-600">Review generated flashcards with an intuitive swipe interface. Mark them as known or unknown to train the spaced-repetition algorithm.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors cursor-default"
            >
              <h3 className="text-xl font-bold text-foreground mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">Track your daily study streaks, review your strongest subjects, and see where you need to focus next time.</p>
            </motion.div>
          </div>

          {/* Visual Mockup Side */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative w-full rounded-2xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col gap-6 bg-gray-50 p-6"
          >
             <img src="/chat.png" alt="Chat Assistant" className="w-full h-auto rounded-xl shadow-lg border border-gray-200 mix-blend-multiply object-cover" />
             <img src="/flashcards.png" alt="Flashcards Studio" className="w-full h-auto rounded-xl shadow-lg border border-gray-200 mix-blend-multiply object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
