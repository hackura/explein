
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const benefits = [
  {
    title: 'Save study time',
    description: 'Cut down on hours spent organizing materials. Explein does the heavy lifting so you can focus on absorbing the content.',
  },
  {
    title: 'Learn faster',
    description: 'Instant explanations and simplified breakdowns mean you do not get stuck on complex concepts.',
  },
  {
    title: 'Personalized explanations',
    description: 'Get answers customized to your learning style, whether you need a high-level overview or an in-depth deep dive.',
  },
  {
    title: 'Better retention',
    description: 'Leverage scientifically proven spaced-repetition techniques embedded natively into our flashcard system.',
  },
];

export default function Benefits() {
  return (
    <section className="py-24 bg-foreground text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why students and professionals choose Explein</h2>
            <p className="text-xl text-gray-400 mb-8">
              We built Explein to solve the exact problems learners face daily. From overwhelmed students to busy professionals upskilling for their careers.
            </p>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">{benefit.title}</h3>
                    <p className="text-gray-400 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2">
             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-2xl relative"
             >
                {/* Decorative blur */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/30 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="relative z-10">
                  <h4 className="text-xl font-semibold mb-6">What users are saying</h4>
                  <div className="space-y-6">
                    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50">
                      <p className="italic text-gray-300 mb-4">"Explein completely changed how I prepare for my med school exams. The AI correctly identified my weak spots within days."</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-700 rounded-full" />
                        <div>
                          <p className="font-medium text-sm">Sarah Jenkins</p>
                          <p className="text-xs text-gray-500">Medical Student</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50">
                      <p className="italic text-gray-300 mb-4">"The note summarizer is magic. I paste 20-page PDFs into it and get perfect study guides instantly."</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-700 rounded-full" />
                        <div>
                          <p className="font-medium text-sm">David Chen</p>
                          <p className="text-xs text-gray-500">Software Engineer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
