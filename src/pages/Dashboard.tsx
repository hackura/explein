import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, Target, Zap, Clock, Loader2, Play } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';


export default function Dashboard() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { name: 'Total Study Time', value: '0 hrs', icon: Clock, change: '0%', trend: 'neutral' },
    { name: 'Flashcards', value: '0', icon: BookOpen, change: '0', trend: 'neutral' },
    { name: 'Saved Notes', value: '0', icon: Zap, change: '0', trend: 'neutral' },
    { name: 'Mastery Level', value: '0%', icon: Target, change: '0%', trend: 'neutral' },
  ]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch flashcard count
      const { count: flashcardCount } = await supabase
        .from('flashcards')
        .select('*', { count: 'exact', head: true });

      // Fetch notes count
      const { count: notesCount } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true });

      // Fetch study activity for last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: activity } = await supabase
        .from('study_activity')
        .select('duration_minutes, created_at')
        .gte('created_at', sevenDaysAgo.toISOString());

      // Fetch mastery (average repetitions / 10 as a proxy)
      const { data: flashcardStats } = await supabase
        .from('flashcards')
        .select('repetitions');

      const totalReps = flashcardStats?.reduce((acc, curr) => acc + (curr.repetitions || 0), 0) || 0;
      const mastery = flashcardCount ? Math.min(100, Math.round((totalReps / (flashcardCount * 10)) * 100)) : 0;

      // Group activity by day for chart
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const chartMap: Record<string, number> = {};
      
      activity?.forEach(act => {
        const day = days[new Date(act.created_at).getDay()];
        chartMap[day] = (chartMap[day] || 0) + (act.duration_minutes / 60);
      });

      const newChartData = days.map(day => ({
        name: day,
        hours: Number((chartMap[day] || 0).toFixed(1))
      }));

      const totalTime = activity?.reduce((acc, curr) => acc + curr.duration_minutes, 0) || 0;

      setStats([
        { name: 'Total Study Time', value: `${(totalTime / 60).toFixed(1)} hrs`, icon: Clock, change: 'Today', trend: 'neutral' },
        { name: 'Flashcards', value: String(flashcardCount || 0), icon: BookOpen, change: 'Total', trend: 'neutral' },
        { name: 'Saved Notes', value: String(notesCount || 0), icon: Zap, change: 'Total', trend: 'neutral' },
        { name: 'Mastery Level', value: `${mastery}%`, icon: Target, change: 'Overall', trend: 'up' },
      ]);

      setChartData(newChartData);

      // Fetch recent notes for activity panel
      const { data: latestNotes } = await supabase
        .from('notes')
        .select('title, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (latestNotes) {
        setRecentActivity(latestNotes.map(n => ({
          title: 'Created Summary',
          subtitle: n.title,
          time: new Date(n.created_at).toLocaleDateString(),
          color: 'bg-blue-500'
        })));
      }

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back, {user?.email?.split('@')[0] || 'Student'}!</h1>
        <p className="mt-2 text-gray-600">Here's an overview of your real-time learning progress.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 truncate">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-gray-500'}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">total</span>
              </div>
              {stat.name === 'Total Study Time' || stat.name === 'Flashcards' ? (
                <Link to="/dashboard/study" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
                   Study Now <Play className="w-3 h-3 fill-current group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Study Time Activity</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
           <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
           <div className="space-y-6">
             {recentActivity.length > 0 ? (
               recentActivity.map((act, i) => (
                <div key={i} className="flex gap-4">
                  <div className={`w-2 h-2 mt-2 rounded-full ${act.color} shrink-0`} />
                  <div>
                      <p className="text-sm font-medium text-gray-900">{act.title}</p>
                      <p className="text-xs text-gray-500">{act.subtitle}</p>
                      <p className="text-xs text-gray-400 mt-1">{act.time}</p>
                  </div>
                </div>
               ))
             ) : (
               <div className="text-center py-12">
                  <p className="text-sm text-gray-400">No recent activity found.</p>
               </div>
             )}
           </div>
           
           <button className="w-full mt-8 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              View All Activity
           </button>
        </div>
      </div>
    </div>
  );
}
