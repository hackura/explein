
import { motion } from 'framer-motion';
import { Bot, Layers, BookOpen, LineChart } from 'lucide-react';

const features = [
  {
    icon: <Bot className="w-6 h-6 text-blue-600" />,
    title: 'AI Study Assistant',
    description: 'Chat with our context-aware AI to get detailed explanations, practical examples, and simplified breakdowns of complex topics.',
    color: 'bg-blue-100',
  },
  {
    icon: <Layers className="w-6 h-6 text-purple-600" />,
    title: 'Flashcard Generator',
    description: 'Instantly generate smart flashcards from any text or document. Review them using spaced repetition for maximum retention.',
    color: 'bg-purple-100',
  },
  {
    icon: <BookOpen className="w-6 h-6 text-emerald-600" />,
    title: 'Smart Notes & Summarizer',
    description: 'Convert long study materials or lectures into perfectly structured notes with headings, bullet points, and key insights.',
    color: 'bg-emerald-100',
  },
  {
    icon: <LineChart className="w-6 h-6 text-orange-600" />,
    title: 'Progress Tracking',
    description: 'Visualize your learning journey with intuitive dashboard charts, activity metrics, and detailed learning analytics.',
    color: 'bg-orange-100',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white relative">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Everything you need to master your studies</h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            A comprehensive suite of tools powered by advanced AI, designed to save you time and maximize learning retention.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300 group"
            >
              <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
