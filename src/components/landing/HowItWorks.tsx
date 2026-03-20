
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Sign up / Log in',
    description: 'Create your free account or sign in with Google to access your personalized learning dashboard.',
  },
  {
    number: '02',
    title: 'Ask or Input Content',
    description: 'Chat with the AI about a topic you are struggling with, or paste long study materials you need summarized.',
  },
  {
    number: '03',
    title: 'Generate Materials',
    description: 'Instantly receive structured notes, study guides, and custom flashcards tailored to your learning style.',
  },
  {
    number: '04',
    title: 'Track Progress',
    description: 'Review your flashcards regularly and watch your knowledge metrics grow on your personal dashboard.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50 border-y border-gray-100">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">How Explein Works</h2>
          <p className="text-xl text-gray-500">From confusion to clarity in four simple steps.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="text-6xl font-black text-gray-200 mb-4 tracking-tighter">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>

              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-transparent -ml-8 scale-x-75 origin-left" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
