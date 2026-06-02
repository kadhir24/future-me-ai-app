import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import {
  Sparkles, Download, Share2, Clock, TrendingUp, MessageCircle,
  Mic, Home, Video, Rocket,
  Brain, Star, Zap, Palette, Lightbulb, Quote, Lock, Crown,
  Wand2, MessageSquareText, Coins, GitBranch, Timer
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { supabase } from '../lib/supabase';
import type { FutureProfile } from '../lib/types';
import PdfTemplate from '../components/PdfTemplate';

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const premiumFeatures = [
  { icon: Mic, label: 'AI Voice From Future Self', desc: 'Hear your future self speak to you with AI-generated voice', tier: 'Future+' },
  { icon: Home, label: 'Future House Generator', desc: 'Generate a visual of your future home and living space', tier: 'Future+' },
  { icon: Video, label: 'Future Avatar Video', desc: 'Watch an AI avatar of your future self come to life', tier: 'Future+' },
  { icon: GitBranch, label: 'Alternate Future Paths', desc: 'Explore what happens if you make different choices', tier: 'Future+' },
  { icon: Timer, label: '2050 Life Simulation', desc: 'Simulate your entire life journey through 2050 and beyond', tier: 'Future+' },
  { icon: MessageSquareText, label: 'AI Future Chat', desc: 'Chat live with your future self and ask anything', tier: 'Future+' },
  { icon: Coins, label: 'Future Wealth Journey', desc: 'Detailed financial trajectory with investment predictions', tier: 'Future+' },
  { icon: Wand2, label: 'Future Transformation Timeline', desc: 'Visual year-by-year transformation of your entire life', tier: 'Future+' },
];

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <motion.circle
            cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-orbitron text-2xl font-bold text-white">{score}</span>
        </div>
      </div>
      <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">{label}</span>
    </div>
  );
}

function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<FutureProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastFeature, setToastFeature] = useState('');

  const showPremiumToast = (featureName: string) => {
    setToastFeature(featureName);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase
        .from('future_profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) { navigate('/'); return; }
      setProfile(data);
      setLoading(false);
    })();
  }, [id, navigate]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'My Future Self - Future Me AI',
        text: `I just discovered my future self! My future title: ${profile?.future_title}`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!profile || isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);

      const tempDiv = document.createElement('div');
      tempDiv.id = 'pdf-render-target';
      container.appendChild(tempDiv);

      const reactRoot = createRoot(tempDiv);
      await new Promise<void>((resolve) => {
        reactRoot.render(
          <PdfTemplate profile={profile} />
        );
        setTimeout(resolve, 200);
      });

      const element = document.getElementById('pdf-render-target');
      if (!element) throw new Error('PDF element not found');

      const opt = {
        margin: 0,
        filename: `future-me-${profile.name}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: '#0a0e1a',
          logging: false,
        },
        jsPDF: {
          unit: 'mm' as const,
          format: 'a4' as const,
          orientation: 'portrait' as const,
        },
      };

      await html2pdf().set(opt).from(element).save();

      reactRoot.unmount();
      document.body.removeChild(container);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [profile, isGeneratingPdf]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center grid-bg">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-neon-blue/15 rounded-full blur-[120px] animate-pulse-glow" />
        </div>
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto rounded-full border-2 border-neon-blue/30 border-t-neon-blue"
          />
          <p className="mt-6 font-orbitron text-neon-blue text-sm tracking-widest">ENTERING THE FUTURE...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen relative overflow-hidden grid-bg"
    >
      {/* Cinematic background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-neon-cyan/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-teal/5 rounded-full blur-[200px]" />
      </div>

      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.1) 2px, rgba(0,212,255,0.1) 4px)' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* ===== HERO SECTION ===== */}
        <motion.div variants={stagger} initial="initial" animate="animate" className="text-center mb-16">
          <motion.div variants={fadeUp} className="mb-4">
            <span className="font-orbitron text-xs tracking-[0.3em] text-neon-cyan/70 uppercase">
              Year {new Date().getFullYear() + 15}
            </span>
          </motion.div>

          {/* Avatar */}
          <motion.div variants={fadeUp} className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-neon-blue/20 to-neon-cyan/20 border border-neon-blue/30 flex items-center justify-center neon-border">
                <Sparkles className="w-14 h-14 sm:w-16 sm:h-16 text-neon-cyan" />
              </div>
              <div className="absolute -inset-3 rounded-full border border-neon-blue/10 animate-pulse-glow" />
              <div className="absolute -inset-6 rounded-full border border-neon-cyan/5 animate-pulse-glow" style={{ animationDelay: '1s' }} />
            </div>
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
            {profile.name}
          </motion.h1>

          <motion.p variants={fadeUp} className="neon-text-cyan font-orbitron text-lg sm:text-xl font-semibold mb-2">
            {profile.future_title}
          </motion.p>

          {/* Future quote */}
          {profile.future_quote && (
            <motion.div variants={fadeUp} className="mt-6 max-w-lg mx-auto">
              <div className="glass-card px-6 py-4 flex items-start gap-3">
                <Quote className="w-5 h-5 text-neon-blue/60 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm italic leading-relaxed">{profile.future_quote}</p>
              </div>
            </motion.div>
          )}

          {/* Action buttons */}
          <motion.div variants={fadeUp} className="flex justify-center gap-3 mt-8">
            <button onClick={handleShare} className="glass-card px-5 py-2.5 flex items-center gap-2 hover:neon-border transition-all duration-300 cursor-pointer">
              <Share2 className="w-4 h-4 text-neon-blue" />
              <span className="text-sm text-gray-300">Share</span>
            </button>
            <button onClick={handleDownload} disabled={isGeneratingPdf} className={`glass-card px-5 py-2.5 flex items-center gap-2 hover:neon-border transition-all duration-300 cursor-pointer ${isGeneratingPdf ? 'opacity-50 cursor-wait' : ''}`}>
              {isGeneratingPdf ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full" />
              ) : (
                <Download className="w-4 h-4 text-neon-cyan" />
              )}
              <span className="text-sm text-gray-300">{isGeneratingPdf ? 'Generating...' : 'Download PDF'}</span>
            </button>
          </motion.div>
        </motion.div>

        {/* ===== SCORE METERS ===== */}
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="mb-12"
        >
          <motion.div variants={fadeUp} className="glass-card-strong p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-neon-teal/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-neon-teal" />
              </div>
              <h3 className="font-orbitron text-sm tracking-wider text-neon-teal uppercase">Future Scores</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
              <ScoreRing score={profile.ai_score} label="AI Future Score" color="#00d4ff" />
              <ScoreRing score={profile.success_meter} label="Success Meter" color="#00f5d4" />
            </div>
          </motion.div>
        </motion.div>

        {/* ===== FUTURE STORY ===== */}
        <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-8">
          <motion.div variants={fadeUp} className="glass-card-strong p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                <Rocket className="w-4 h-4 text-neon-blue" />
              </div>
              <h3 className="font-orbitron text-sm tracking-wider text-neon-blue uppercase">Your Future Story</h3>
            </div>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {profile.future_story}
            </p>
          </motion.div>

          {/* ===== PERSONALITY EVOLUTION ===== */}
          {profile.personality_evolution && (
            <motion.div variants={fadeUp} className="glass-card-strong p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-neon-cyan" />
                </div>
                <h3 className="font-orbitron text-sm tracking-wider text-neon-cyan uppercase">Personality Evolution</h3>
              </div>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {profile.personality_evolution}
              </p>
            </motion.div>
          )}

          {/* ===== ACHIEVEMENT TIMELINE ===== */}
          <motion.div variants={fadeUp} className="glass-card-strong p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-neon-cyan" />
              </div>
              <h3 className="font-orbitron text-sm tracking-wider text-neon-cyan uppercase">Achievement Timeline</h3>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-neon-blue/40 via-neon-cyan/40 to-transparent" />
              <div className="space-y-6">
                {profile.achievements.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.12 }}
                    className="flex gap-4 items-start"
                  >
                    <div className="relative flex-shrink-0 w-8 h-8 rounded-full bg-dark-bg border border-neon-blue/30 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-neon-blue" />
                    </div>
                    <div>
                      <span className="font-orbitron text-xs text-neon-blue">{item.year}</span>
                      <p className="text-gray-300 text-sm mt-0.5">{item.event}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ===== INCOME & SUCCESS ===== */}
          <motion.div variants={fadeUp} className="glass-card-strong p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-neon-teal/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-neon-teal" />
              </div>
              <h3 className="font-orbitron text-sm tracking-wider text-neon-teal uppercase">Income & Success Prediction</h3>
            </div>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {profile.future_income}
            </p>
          </motion.div>

          {/* ===== GLOW-UP EVOLUTION ===== */}
          {profile.glow_up && (
            <motion.div variants={fadeUp} className="glass-card-strong p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                  <Star className="w-4 h-4 text-neon-blue" />
                </div>
                <h3 className="font-orbitron text-sm tracking-wider text-neon-blue uppercase">Glow-Up Evolution</h3>
              </div>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {profile.glow_up}
              </p>
            </motion.div>
          )}

          {/* ===== DAILY ROUTINE ===== */}
          <motion.div variants={fadeUp} className="glass-card-strong p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-neon-blue" />
              </div>
              <h3 className="font-orbitron text-sm tracking-wider text-neon-blue uppercase">Future Daily Routine</h3>
            </div>
            <div className="space-y-2.5">
              {profile.future_routine.split('\n').map((line, i) => (
                <div key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan/60 mt-2 flex-shrink-0" />
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ===== WORKSPACE VIBE ===== */}
          {profile.workspace_vibe && (
            <motion.div variants={fadeUp} className="glass-card-strong p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
                  <Palette className="w-4 h-4 text-neon-cyan" />
                </div>
                <h3 className="font-orbitron text-sm tracking-wider text-neon-cyan uppercase">Future Workspace Vibe</h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                {profile.workspace_vibe}
              </p>
            </motion.div>
          )}

          {/* ===== HIDDEN TALENT ===== */}
          {profile.hidden_talent && (
            <motion.div variants={fadeUp} className="glass-card-strong p-6 sm:p-8 neon-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-neon-cyan" />
                </div>
                <h3 className="font-orbitron text-sm tracking-wider text-neon-cyan uppercase">Hidden Talent Prediction</h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                {profile.hidden_talent}
              </p>
            </motion.div>
          )}

          {/* ===== MESSAGE FROM FUTURE SELF ===== */}
          <motion.div variants={fadeUp} className="glass-card-strong p-6 sm:p-8 neon-border-cyan">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-neon-cyan" />
              </div>
              <h3 className="font-orbitron text-sm tracking-wider text-neon-cyan uppercase">Message from Your Future Self</h3>
            </div>
            <p className="text-gray-200 leading-relaxed whitespace-pre-line text-sm sm:text-base italic">
              {profile.future_advice}
            </p>
          </motion.div>

          {/* ===== FUTURE+ PREMIUM FEATURES ===== */}
          <motion.div variants={fadeUp}>
            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-neon-blue" />
                <h3 className="font-orbitron text-sm tracking-wider text-neon-blue uppercase">Future+ Premium</h3>
              </div>
              <span className="font-orbitron text-[10px] tracking-[0.2em] text-neon-cyan/50 uppercase bg-neon-cyan/5 px-3 py-1 rounded-full border border-neon-cyan/10">
                Coming Soon
              </span>
            </div>

            {/* Premium feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {premiumFeatures.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.5 + i * 0.08 }}
                  onClick={() => showPremiumToast(feature.label)}
                  className="group relative glass-card p-5 cursor-pointer overflow-hidden
                    border border-white/5 hover:border-neon-blue/25
                    transition-all duration-500"
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/0 to-neon-cyan/0 group-hover:from-neon-blue/5 group-hover:to-neon-cyan/5 transition-all duration-500 rounded-2xl" />

                  {/* Lock badge */}
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-neon-blue/30 group-hover:bg-neon-blue/10 transition-all duration-300">
                    <Lock className="w-3 h-3 text-gray-500 group-hover:text-neon-blue/70 transition-colors duration-300" />
                  </div>

                  <div className="relative z-10 flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0
                      group-hover:bg-neon-blue/10 group-hover:border-neon-blue/20 transition-all duration-300">
                      <feature.icon className="w-5 h-5 text-gray-500 group-hover:text-neon-blue/70 transition-colors duration-300" />
                    </div>

                    <div className="flex-1 pr-6">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm text-gray-300 font-medium group-hover:text-gray-100 transition-colors">{feature.label}</p>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">{feature.desc}</p>

                      {/* Tier badge */}
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neon-blue/5 border border-neon-blue/10">
                        <Crown className="w-2.5 h-2.5 text-neon-blue/50" />
                        <span className="text-[10px] font-orbitron tracking-wider text-neon-blue/50 uppercase">{feature.tier}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom shimmer line */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-blue/0 to-transparent group-hover:via-neon-blue/20 transition-all duration-500" />
                </motion.div>
              ))}
            </div>

            {/* Bottom CTA teaser */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="mt-6 text-center"
            >
              <p className="text-xs text-gray-500 font-medium">
                Unlock deeper future experiences with <span className="text-neon-blue/70">Future+ Premium</span> — arriving soon.
              </p>
            </motion.div>
          </motion.div>

          {/* ===== PREMIUM TOAST ===== */}
          <motion.div
            initial={false}
            animate={toastVisible ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none ${toastVisible ? '' : 'hidden'}`}
          >
            <div className="glass-card-strong px-6 py-3 neon-border flex items-center gap-3">
              <Lock className="w-4 h-4 text-neon-blue" />
              <span className="text-sm text-gray-200 font-medium">
                {toastFeature}
              </span>
              <span className="text-sm text-neon-cyan">— Future+ Premium feature arriving soon.</span>
            </div>
          </motion.div>

          {/* ===== FOOTER ===== */}
          <motion.div variants={fadeUp} className="text-center pt-8 pb-4">
            <p className="text-gray-600 text-xs font-orbitron tracking-wider">
              FUTURE ME AI — YOUR FUTURE IS WAITING
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ResultPage;
