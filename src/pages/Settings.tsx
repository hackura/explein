import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Bell, Shield, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Settings() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user?.id)
      .single();

    if (!error && data) {
      setName(data.full_name || '');
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    setSaveSuccess(false);

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: name,
        updated_at: new Date().toISOString(),
      });

    if (!error) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your profile, account preferences, and security synced with Supabase.</p>
      </div>

      <div className="bg-white px-4 py-6 shadow-sm border border-gray-200 sm:rounded-2xl sm:p-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-blue-600" />
          Profile Information
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Display Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm transition-all"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              value={user?.email || ''}
              disabled
              className="mt-1 block w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 shadow-sm sm:text-sm cursor-not-allowed"
            />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-4">
           <button 
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
           >
             {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
           </button>
           {saveSuccess && (
             <span className="text-green-600 text-sm font-medium flex items-center gap-1 animate-in fade-in slide-in-from-left-2">
               <CheckCircle2 className="w-4 h-4" />
               Profile updated successfully!
             </span>
           )}
        </div>
      </div>

      <div className="bg-white px-4 py-6 shadow-sm border border-gray-200 sm:rounded-2xl sm:p-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-blue-600" />
          Notifications
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Email Notifications</p>
            <p className="text-sm text-gray-500">Receive weekly study summaries and reminders.</p>
          </div>
          <button 
            type="button" 
            onClick={() => setNotifications(!notifications)}
            className={`${notifications ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            <span className={`${notifications ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
          </button>
        </div>
      </div>

      <div className="bg-white px-4 py-6 shadow-sm border border-gray-200 sm:rounded-2xl sm:p-6 text-red-600">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-red-600">
          <Shield className="w-5 h-5" />
          Danger Zone
        </h2>
        <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <button className="px-4 py-2 border border-red-200 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  );
}
