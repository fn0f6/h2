
import React, { useState, useMemo, useRef } from 'react';
import { useSettings } from '../context/SettingsContext';
import { apiService } from '../services/api';
import { 
  BarChart3, Newspaper, Mail, Settings, LogOut, 
  Trash2, Plus, ShieldCheck, Activity, Globe, 
  X, Upload, Loader2, CheckCircle2,
  Type as TypeIcon, Link as LinkIcon, Menu, Share2, 
  MessageCircle, Twitter, Instagram, Youtube, Send, 
  Facebook, Music, Ghost, Users, Eye, EyeOff,
  Image as ImageIcon, Search, QrCode, Smartphone, Apple,
  Layers, Monitor, Palette
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { settings, updateSettings, tickets, news, addNews, deleteNews, deleteTicket, logout } = useSettings();
  const [activeTab, setActiveTab] = useState<'stats' | 'news' | 'media' | 'fleet' | 'texts' | 'inbox' | 'social' | 'system'>('stats');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [newNews, setNewNews] = useState({ title: '', excerpt: '', thumbnailUrl: '', category: 'Announcement' });
  
  const newsFileRef = useRef<HTMLInputElement>(null);
  const logoFileRef = useRef<HTMLInputElement>(null);
  const heroBgFileRef = useRef<HTMLInputElement>(null);
  const qrFileRef = useRef<HTMLInputElement>(null);

  const triggerSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string, isShowcase = false) => {
    if (e.target.files && e.target.files[0]) {
      setIsSaving(true);
      try {
        const url = await apiService.uploadImage(e.target.files[0], isShowcase ? 'showcase' : 'identity');
        if (isShowcase) {
          const updatedImages = { ...settings.showcaseImages, [fieldKey]: url };
          await updateSettings({ showcaseImages: updatedImages });
        } else if (fieldKey === 'news') {
          setNewNews(prev => ({ ...prev, thumbnailUrl: url }));
        } else {
          await updateSettings({ [fieldKey]: url });
        }
        triggerSuccess();
      } catch (err) {
        alert("Upload failed. Make sure the 'assets' bucket exists and is public.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleAddNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNews.thumbnailUrl) { alert("Please upload a thumbnail first."); return; }
    setIsSaving(true);
    try {
      await addNews(newNews);
      setNewNews({ title: '', excerpt: '', thumbnailUrl: '', category: 'Announcement' });
      setShowNewsForm(false);
      triggerSuccess();
    } finally { setIsSaving(false); }
  };

  const handleSocialToggle = (key: string) => {
    const activeLinks = { ...settings.socialLinks.activeLinks, [key]: !(settings.socialLinks.activeLinks as any)[key] };
    updateSettings({ socialLinks: { ...settings.socialLinks, activeLinks } });
  };

  const filteredTranslationKeys = useMemo(() => {
    const keys = Object.keys(settings.translations.ar);
    if (!searchText) return keys;
    return keys.filter(k => 
      k.toLowerCase().includes(searchText.toLowerCase()) || 
      settings.translations.ar[k].includes(searchText) ||
      settings.translations.en[k].toLowerCase().includes(searchText.toLowerCase())
    );
  }, [settings.translations, searchText]);

  return (
    <div className="min-h-screen flex bg-[#030303] text-slate-100 font-sans">
      {saveSuccess && (
        <div className="fixed top-6 right-6 z-[200] flex items-center gap-3 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl animate-fade-in-up">
          <CheckCircle2 size={20} />
          <span className="text-xs font-black uppercase tracking-widest">Success</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 w-64 bg-black border-r border-white/5 flex flex-col p-6 h-screen z-[150] transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center"><ShieldCheck className="text-black" size={24} /></div>
          <span className="font-display font-black text-xl uppercase tracking-tighter">Admin</span>
        </div>
        <nav className="space-y-1 flex-1">
          {[
            { id: 'stats', label: 'Overview', icon: BarChart3 },
            { id: 'news', label: 'News Center', icon: Newspaper },
            { id: 'media', label: 'Assets', icon: Layers },
            { id: 'texts', label: 'Languages', icon: TypeIcon },
            { id: 'social', label: 'Social', icon: Share2 },
            { id: 'inbox', label: 'Inbox', icon: Mail },
            { id: 'system', label: 'Settings', icon: Settings },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all ${activeTab === t.id ? 'bg-gold text-black' : 'text-slate-500 hover:bg-white/5'}`}>
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </nav>
        <button onClick={logout} className="flex items-center gap-4 px-4 py-3 text-red-500 font-bold uppercase tracking-widest text-[10px] mt-auto"><LogOut size={18} /> Logout</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex items-center justify-between mb-12 border-b border-white/5 pb-8">
           <h1 className="text-3xl font-display font-black uppercase tracking-tight">{activeTab.toUpperCase()}</h1>
           {isSaving && <Loader2 className="animate-spin text-gold" size={20} />}
        </header>

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
              <p className="text-slate-500 text-[10px] uppercase font-black mb-2">Total News</p>
              <h3 className="text-3xl font-bold">{news.length}</h3>
            </div>
            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
              <p className="text-slate-500 text-[10px] uppercase font-black mb-2">Support Tickets</p>
              <h3 className="text-3xl font-bold">{tickets.length}</h3>
            </div>
            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
              <p className="text-slate-500 text-[10px] uppercase font-black mb-2">System Status</p>
              <h3 className={`text-3xl font-bold ${settings.isMaintenanceMode ? 'text-red-500' : 'text-emerald-500'}`}>
                {settings.isMaintenanceMode ? 'Maintenance' : 'Live'}
              </h3>
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="space-y-8">
            <button onClick={() => setShowNewsForm(!showNewsForm)} className="bg-gold text-black px-8 py-4 rounded-xl font-black uppercase text-xs">
              {showNewsForm ? 'Cancel' : 'Add New Article'}
            </button>
            {showNewsForm && (
              <form onSubmit={handleAddNewsSubmit} className="bg-white/5 p-8 rounded-[2rem] border border-white/10 space-y-6">
                <input type="text" placeholder="Title" value={newNews.title} onChange={e => setNewNews({...newNews, title: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-white" required />
                <textarea placeholder="Excerpt" value={newNews.excerpt} onChange={e => setNewNews({...newNews, excerpt: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-4 text-white h-24" required />
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => newsFileRef.current?.click()} className="bg-white/10 px-6 py-4 rounded-xl text-xs font-bold uppercase">Upload Thumbnail</button>
                  <input type="file" ref={newsFileRef} className="hidden" onChange={e => handleFileUpload(e, 'news')} />
                  {newNews.thumbnailUrl && <img src={newNews.thumbnailUrl} className="h-12 w-12 rounded-lg object-cover" />}
                </div>
                <button type="submit" className="w-full bg-white text-black py-4 rounded-xl font-black uppercase text-xs">Publish News</button>
              </form>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.map(n => (
                <div key={n.id} className="bg-white/5 p-6 rounded-3xl border border-white/10 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img src={n.thumbnailUrl} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-white">{n.title}</h4>
                      <p className="text-xs text-slate-500">{n.category}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteNews(n.id)} className="p-3 text-red-500"><Trash2 size={20} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'media' && (
          <div className="grid md:grid-cols-2 gap-10">
             <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-8">
               <h3 className="font-bold uppercase tracking-widest text-gold text-xs">Site Identity</h3>
               <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase text-slate-500">Main Logo</label>
                 <div className="flex items-center gap-6">
                   <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center p-2 border border-white/10">
                      <img src={settings.logoUrl} className="max-h-full max-w-full" />
                   </div>
                   <button onClick={() => logoFileRef.current?.click()} className="bg-white/5 border border-white/10 px-6 py-3 rounded-xl text-[10px] font-bold uppercase">Update Logo</button>
                   <input type="file" ref={logoFileRef} className="hidden" onChange={e => handleFileUpload(e, 'logoUrl')} />
                 </div>
               </div>
               <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase text-slate-500">Hero Background</label>
                 <div className="relative h-40 rounded-2xl overflow-hidden border border-white/10 group">
                    <img src={settings.heroBgUrl} className="w-full h-full object-cover brightness-50" />
                    <button onClick={() => heroBgFileRef.current?.click()} className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all font-black uppercase text-[10px]">Change Background</button>
                    <input type="file" ref={heroBgFileRef} className="hidden" onChange={e => handleFileUpload(e, 'heroBgUrl')} />
                 </div>
               </div>
             </div>

             <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-8">
                <h3 className="font-bold uppercase tracking-widest text-gold text-xs">Showcase Images</h3>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(settings.showcaseImages).map(([key, url]) => (
                    <div key={key} className="space-y-2">
                      <div className="aspect-[9/16] bg-black rounded-xl overflow-hidden relative group border border-white/5">
                        <img src={url} className="w-full h-full object-cover" />
                        <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer">
                          <Upload size={16} />
                          <input type="file" className="hidden" onChange={e => handleFileUpload(e, key, true)} />
                        </label>
                      </div>
                      <p className="text-[8px] font-black uppercase text-center text-slate-500">{key}</p>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="grid md:grid-cols-2 gap-6">
            {Object.keys(settings.socialLinks.activeLinks).map(key => (
              <div key={key} className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center gap-4">
                <button onClick={() => handleSocialToggle(key)} className={`p-3 rounded-xl ${ (settings.socialLinks.activeLinks as any)[key] ? 'bg-gold text-black' : 'bg-white/5 text-slate-500' }`}>
                  {(settings.socialLinks.activeLinks as any)[key] ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <input 
                  type="text" 
                  value={(settings.socialLinks as any)[key]} 
                  onChange={e => updateSettings({ socialLinks: { ...settings.socialLinks, [key]: e.target.value } })}
                  placeholder={`${key} link...`}
                  className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-xs"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'inbox' && (
          <div className="space-y-6">
            {tickets.map(t => (
              <div key={t.id} className="bg-white/5 p-8 rounded-[2rem] border border-white/10 flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="font-bold text-gold">{t.subject}</h4>
                  <p className="text-sm text-slate-300">{t.message}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">{t.name} • {t.email}</p>
                </div>
                <button onClick={() => deleteTicket(t.id)} className="text-red-500"><Trash2 size={20} /></button>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
