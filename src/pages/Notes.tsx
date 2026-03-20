import { useState, useEffect } from 'react';
import { FileText, Wand2, Loader2, History } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function Notes() {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState('');
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRecentNotes();
    }
  }, [user]);

  const fetchRecentNotes = async () => {
    setLoadingNotes(true);
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error && data) {
      setRecentNotes(data);
    }
    setLoadingNotes(false);
  };

  const handleGenerate = async () => {
    if (!inputText.trim() || !user) return;
    setIsGenerating(true);
    
    try {
      const { data, error: funcError } = await supabase.functions.invoke('generate-study-material', {
        body: { type: 'summary', content: inputText }
      });

      if (funcError) throw funcError;
      if (data && data.error) throw new Error(data.error);
      
      const generatedSummary = typeof data === 'string' ? data : JSON.stringify(data);
      setSummary(generatedSummary);
      
      // Auto-save to Supabase
      const { error: dbError } = await supabase.from('notes').insert([{
        user_id: user.id,
        title: inputText.slice(0, 40) + (inputText.length > 40 ? '...' : ''),
        content: generatedSummary
      }]);

      if (!dbError) {
        fetchRecentNotes();
      }
    } catch (err: any) {
      console.error('AI Generation failed:', err);
      setSummary(`Error: ${err.message || "Failed to generate notes. Please check your Gemini API configuration in Supabase Secrets."}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 flex flex-col h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Smart Notes</h1>
        <p className="mt-2 text-gray-600">Transform your raw text into structured, persisted study notes.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
        {/* Left: Editor */}
        <div className="flex-[2] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Source Text</label>
            <span className="text-xs text-gray-400">{inputText.length} chars</span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 p-4 rounded-xl border border-gray-200 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm"
            placeholder="Paste your lecture notes or transcripts here..."
          />
          <button 
            onClick={handleGenerate}
            disabled={!inputText.trim() || isGenerating}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : <><Wand2 className="w-5 h-5" /> Generate & Save</>}
          </button>
        </div>

        {/* Right: Preview & History */}
        <div className="flex-[3] flex flex-col gap-6 min-h-0">
          <div className="flex-1 flex flex-col gap-4 min-h-0">
            <label className="text-sm font-medium text-gray-700">Generated Summary</label>
            <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-y-auto">
              {summary ? (
                <div className="prose prose-blue max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-base">{summary}</pre>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <FileText className="w-16 h-16 text-gray-200" />
                  <p>Your generated notes will appear here and sync to your account</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Notes History Sidebar-style inside the page */}
          <div className="h-48 shrink-0 bg-gray-50 rounded-xl border border-gray-100 p-4 overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-900 uppercase tracking-wider">
               <History className="w-4 h-4" />
               Recent Notes
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
               {loadingNotes ? (
                 <div className="h-full flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>
               ) : recentNotes.length > 0 ? (
                 recentNotes.map(note => (
                   <button 
                    key={note.id} 
                    onClick={() => setSummary(note.content)}
                    className="w-full text-left p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 transition-all group"
                   >
                     <p className="text-sm font-medium text-gray-700 truncate group-hover:text-blue-600">{note.title}</p>
                     <p className="text-xs text-gray-400">{new Date(note.created_at).toLocaleDateString()}</p>
                   </button>
                 ))
               ) : (
                 <p className="text-xs text-gray-400 italic">No previous notes saved.</p>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
