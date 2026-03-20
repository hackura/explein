import { useState, useEffect } from 'react';
import { Layers, Plus, RotateCcw, Loader2, Zap, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  deck_name?: string;
  next_review?: string;
}

export default function Flashcards() {
  const { user } = useAuth();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genText, setGenText] = useState('');
  const [showGenUI, setShowGenUI] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFlashcards();
    }
  }, [user]);

  const fetchFlashcards = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setFlashcards(data);
    }
    setLoading(false);
  };

  const handleAIGenerate = async () => {
    if (!genText.trim() || !user) return;
    setIsGenerating(true);
    try {
      const { data, error: funcError } = await supabase.functions.invoke('generate-study-material', {
        body: { type: 'flashcards', content: genText }
      });

      if (funcError) throw funcError;
      if (data.error) throw new Error(data.error);

      const generatedCards = data.flashcards || [];
      
      // Save all generated cards to DB
      const cardsToInsert = generatedCards.map((card: any) => ({
        user_id: user.id,
        front: card.front,
        back: card.back,
      }));

      const { error: dbError } = await supabase.from('flashcards').insert(cardsToInsert);
      
      if (!dbError) {
        setGenText('');
        setShowGenUI(false);
        fetchFlashcards();
      }
    } catch (err: any) {
      console.error('AI Flashcard generation failed:', err);
      alert(`Flashcard generation failed: ${err.message || "Check your Gemini API configuration in Supabase Secrets."}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const nextCard = () => {
    if (flashcards.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const handleManualAdd = async () => {
    if (!user) return;
    const newCard = {
      user_id: user.id,
      front: 'New Concept',
      back: 'Definition goes here...',
    };
    const { error } = await supabase.from('flashcards').insert([newCard]);
    if (!error) fetchFlashcards();
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Flashcards</h1>
          <p className="mt-2 text-gray-600">Review your study cards or generate new ones with AI.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/dashboard/study"
            className="px-4 py-2 bg-foreground text-background rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors font-bold shadow-md"
          >
            <Play className="w-4 h-4 fill-current" />
            Start Session
          </Link>
          <button 
            onClick={() => setShowGenUI(!showGenUI)}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg flex items-center gap-2 hover:bg-blue-100 transition-colors font-medium"
          >
            <RotateCcw className="w-5 h-5" />
            AI Generate
          </button>
          <button 
            onClick={handleManualAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Card
          </button>
        </div>
      </div>

      {showGenUI && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-blue-50 rounded-2xl p-6 border border-blue-100 space-y-4"
        >
          <label className="text-sm font-bold text-blue-900 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            What should these flashcards be about?
          </label>
          <textarea
            value={genText}
            onChange={(e) => setGenText(e.target.value)}
            className="w-full h-32 p-4 rounded-xl border border-blue-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="Paste text, topics, or key points here..."
          />
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => setShowGenUI(false)}
              className="px-4 py-2 text-blue-600 font-medium"
              disabled={isGenerating}
            >
              Cancel
            </button>
            <button 
              onClick={handleAIGenerate}
              disabled={!genText.trim() || isGenerating}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-100 flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create with AI'}
            </button>
          </div>
        </motion.div>
      )}

      {flashcards.length > 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[450px]">
          <div className="text-sm font-medium text-gray-500 mb-8">
            Card {currentIndex + 1} of {flashcards.length}
          </div>
          
          <div 
            className="relative w-full max-w-2xl h-80 perspective-1000 cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              className="w-full h-full relative"
              initial={false}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center justify-center p-8 text-center" style={{ backfaceVisibility: 'hidden' }}>
                <Layers className="w-8 h-8 text-gray-300 mb-6" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                  {flashcards[currentIndex].front}
                </h2>
                <p className="mt-8 text-sm text-gray-400 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Click to flip
                </p>
              </div>

              <div className="absolute inset-0 w-full h-full backface-hidden bg-blue-600 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center text-white" 
                   style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <div className="h-full w-full overflow-y-auto flex items-center justify-center scrollbar-hide">
                  <p className="text-xl md:text-2xl font-medium leading-relaxed">
                    {flashcards[currentIndex].back}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-12 flex gap-4">
            <button 
              onClick={nextCard}
              className="px-8 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors border border-red-100"
            >
              Needs Practice
            </button>
            <button 
              onClick={nextCard}
              className="px-8 py-3 bg-green-50 text-green-600 rounded-xl font-bold hover:bg-green-100 transition-colors border border-green-100"
            >
              Got It
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dashed border-gray-200">
           <Layers className="w-16 h-16 text-gray-200 mb-4" />
           <p className="text-gray-500 max-w-xs">No flashcards yet. Click "AI Generate" or "Add Card" to create your first one!</p>
        </div>
      )}
    </div>
  );
}
