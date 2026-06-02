import { motion } from 'framer-motion';
import { LogOut, Settings, User as UserIcon, Menu, X } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  children: React.ReactNode;
}

export function Dashboard({ children }: DashboardProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const userEmail = user?.email || '';
  const userName = userEmail.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -256 }}
        animate={{ x: sidebarOpen ? 0 : -256 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-full w-64 backdrop-blur-xl bg-white/5 border-r border-white/10 p-6 z-50 lg:static lg:translate-x-0"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col h-full"
        >
          {/* Brand */}
          <h2 className="font-orbitron text-lg font-bold text-white mb-8">Future Me</h2>

          {/* User Profile */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm capitalize truncate">{userName}</p>
              <p className="text-gray-400 text-xs truncate">{userEmail}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all group"
            >
              <div className="w-8 h-8 rounded flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:from-blue-500/40 group-hover:to-cyan-500/40 transition-all">
                <UserIcon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Profile</span>
            </button>

            <button
              onClick={() => navigate('/settings')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all group"
            >
              <div className="w-8 h-8 rounded flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:from-blue-500/40 group-hover:to-cyan-500/40 transition-all">
                <Settings className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Settings</span>
            </button>
          </nav>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 transition-all group"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="backdrop-blur-xl bg-white/5 border-b border-white/10 px-6 py-4 lg:hidden flex items-center justify-between">
          <h1 className="font-orbitron text-lg font-bold text-white">Future Me AI</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-6 md:p-10"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {userName}</h2>
              <p className="text-gray-400">Ready to explore your future?</p>
            </div>

            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
