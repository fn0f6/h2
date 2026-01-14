
import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Skull, Lock, ArrowLeft, Loader2 } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const { login, navigateTo } = useSettings();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    // محاكاة تأخير بسيط للتحقق
    setTimeout(() => {
      const success = login(password);
      if (!success) {
        setError(true);
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#050301] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-wood-pattern opacity-5 pointer-events-none"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold/5 rounded-full blur-[120px]"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md animate-fade-in-up">
        <button 
          onClick={() => navigateTo('site')}
          className="flex items-center gap-2 text-wood-500 hover:text-gold transition-colors mb-8 font-bold uppercase tracking-widest text-xs group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Portal
        </button>

        <div className="bg-wood-950/40 backdrop-blur-3xl border border-white/5 p-10 md:p-12 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gold rounded-3xl rotate-12 flex items-center justify-center shadow-2xl">
            <Skull className="text-wood-900 -rotate-12" size={36} />
          </div>

          <div className="text-center mt-6 mb-10">
            <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter mb-2">Captain's Quarters</h2>
            <p className="text-wood-500 text-sm font-medium">Authentication required to command the fleet.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wood-500 ml-1">Fleet Cipher</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-wood-500" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-black/60 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-14 pr-6 py-5 outline-none focus:border-gold/50 transition-all text-white placeholder:text-wood-800`}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2 ml-1">Access Denied: Invalid Cipher</p>}
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-wood-900 font-black h-16 rounded-2xl uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(255,215,0,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : 'Unlock Quarters'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[9px] text-wood-700 font-black uppercase tracking-[0.3em]">Authorized Personnel Only</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
