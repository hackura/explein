import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, RotateCcw, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  ease_factor: number;
  interval: number;
  repetitions: number;
}

export default function StudySession() {
  const { user } = useAuth();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (user) {
      fetchDueCards();
    }
  }, [user]);

  useEffect(() => {
    if (sessionComplete && user) {
      logActivity();
    }
  }, [sessionComplete]);

  const logActivity = async () => {
    const durationMinutes = Math.max(1, Math.round((Date.now() - startTime) / 60000));
    await supabase.from('study_activity').insert([{
      user_id: user?.id,
      duration_minutes: durationMinutes,
      activity_type: 'flashcards'
    }]);
  };

  const fetchDueCards = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .lte('next_review', new Date().toISOString())
      .order('next_review', { ascending: true })
      .limit(10); // Batch study

    if (!error && data) {
      setCards(data);
    }
    setLoading(false);
  };

  const handleRate = async (grade: number) => {
    const card = cards[currentIndex];
    let { ease_factor, interval, repetitions } = card;

    // SM-2 Algorithm logic (simplified)
    if (grade >= 2) { // Good or Easy or Hard
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * ease_factor);
      }
      repetitions++;
    } else { // Again
      repetitions = 0;
      interval = 0;
    }

    // Adjust ease factor
    ease_factor = Math.max(1.3, ease_factor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)));

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    await supabase.from('flashcards').update({
      ease_factor,
      interval,
      repetitions,
      next_review: nextReview.toISOString()
    }).eq('id', card.id);

    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
    } else {
      setSessionComplete(true);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Session Complete!</h1>
        <p className="text-gray-600 mb-10">Great job! You've reviewed all cards due for today.</p>
        <Link to="/dashboard" className="block w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-6">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-600">
           <Sparkles className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">You're All Caught Up!</h1>
        <p className="text-gray-600 mb-8">No cards are due for review right now. Come back later or generate new cards.</p>
        <Link to="/dashboard/flashcards" className="text-blue-600 font-semibold hover:underline">
          Go to Flashcards Library
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
       <div className="flex items-center justify-between mb-8 shrink-0">
        <Link to="/dashboard/flashcards" className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Exit Session
         </Link>
         <div className="px-4 py-1.5 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
           CARD {currentIndex + 1} OF {cards.length}
         </div>
       </div>

       <div className="flex-1 flex flex-col items-center justify-center min-h-0 py-8">
          <div 
            className="relative w-full h-full max-h-[400px] perspective-1000 cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              className="w-full h-full relative"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center justify-center p-8 md:p-12 text-center" style={{ backfaceVisibility: 'hidden' }}>
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {cards[currentIndex].front}
                </h2>
                {!isFlipped && (
                  <p className="mt-12 text-sm text-gray-400 animate-pulse">
                    Click to reveal answer
                  </p>
                )}
              </div>

              {/* Back */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-blue-600 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 md:p-12 text-center text-white" 
                   style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <div className="h-full w-full overflow-y-auto flex items-center justify-center scrollbar-hide">
                  <p className="text-xl md:text-3xl font-medium leading-relaxed">
                    {cards[currentIndex].back}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
       </div>

       <AnimatePresence>
         {isFlipped && (
           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-4 gap-3 md:gap-4 mt-8 shrink-0"
           >
             {[
               { grade: 1, label: 'Again', color: 'bg-red-50 text-red-600 border-red-100' },
               { grade: 3, label: 'Hard', color: 'bg-orange-50 text-orange-600 border-orange-100' },
               { grade: 4, label: 'Good', color: 'bg-blue-50 text-blue-600 border-blue-100' },
               { grade: 5, label: 'Easy', color: 'bg-green-50 text-green-600 border-green-100' }
             ].map((btn) => (
               <button
                key={btn.grade}
                onClick={(e) => { e.stopPropagation(); handleRate(btn.grade); }}
                className={`${btn.color} py-4 rounded-2xl font-bold text-sm md:text-base border transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1`}
               >
                 {btn.label}
               </button>
             ))}
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
}
