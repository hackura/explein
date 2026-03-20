import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Flashcards from './pages/Flashcards';
import Notes from './pages/Notes';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import StudySession from './pages/StudySession';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="chat" element={<Chat />} />
            <Route path="flashcards" element={<Flashcards />} />
            <Route path="notes" element={<Notes />} />
            <Route path="settings" element={<Settings />} />
            <Route path="study" element={<StudySession />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
