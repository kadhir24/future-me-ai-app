import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Landing from './pages/Landing';
import InputPage from './pages/InputPage';
import ResultPage from './pages/ResultPage';
import { AuthProvider, useAuth } from './lib/auth';
import { AuthGate } from './components/AuthGate';
import { Dashboard } from './components/Dashboard';
import { AnimatePresence } from 'framer-motion';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-2 border-blue-500/30 border-t-blue-500"
        />
      </div>
    );
  }

  if (!user) {
    return <AuthGate />;
  }

  return (
    <Dashboard>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/input" element={<InputPage />} />
          <Route path="/result/:id" element={<ResultPage />} />
        </Routes>
      </AnimatePresence>
    </Dashboard>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
