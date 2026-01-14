
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { SupportTicket, NewsItem } from '../types';
import { apiService } from '../services/api';

export type Language = 'en' | 'ar';

export interface SocialLinks {
  showSocials: boolean;
  whatsapp: string;
  whatsappGroup: string;
  telegram: string;
  discord: string;
  instagram: string;
  twitter: string;
  youtube: string;
  facebook: string;
  tiktok: string;
  snapchat: string;
  activeLinks: {
    whatsapp: boolean;
    whatsappGroup: boolean;
    telegram: boolean;
    discord: boolean;
    instagram: boolean;
    twitter: boolean;
    youtube: boolean;
    facebook: boolean;
    tiktok: boolean;
    snapchat: boolean;
  };
}

export interface SiteSettings {
  logoUrl: string; heroBgUrl: string; siteBgColor: string; primaryColor: string; secondaryColor: string;
  siteTitle: string; androidUrl: string; iosUrl: string; isMaintenanceMode: boolean; maintenanceMessage: string;
  qrData: string; 
  customQrUrl: string;
  showcaseImages: { map: string; rank: string; tasks: string; chat: string; store: string; warehouse: string; };
  translations: Record<Language, any>;
  socialLinks: SocialLinks;
}

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  tickets: SupportTicket[];
  news: NewsItem[];
  addTicket: (ticket: any) => Promise<void>;
  addNews: (news: any) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  deleteTicket: (id: number) => Promise<void>;
  isLoading: boolean;
  currentPage: 'site' | 'admin' | 'login';
  navigateTo: (page: 'site' | 'admin' | 'login') => void;
  isAuthenticated: boolean;
  login: (pass: string) => boolean;
  logout: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: any;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const DEFAULT_SETTINGS: SiteSettings = {
  logoUrl: 'assets/logo.svg', heroBgUrl: 'assets/background.svg', siteBgColor: '#050505',
  primaryColor: '#10b981', secondaryColor: '#b45309', siteTitle: 'عصر الهامور',
  androidUrl: '#', iosUrl: '#', isMaintenanceMode: false, maintenanceMessage: 'الأسطول في مهمة صيانة سريعة، سنعود قريباً!',
  qrData: '', 
  customQrUrl: '',
  showcaseImages: { map: 'assets/map.png', rank: 'assets/rank.png', tasks: 'assets/tasks.png', chat: 'assets/chat.png', store: 'assets/store.png', warehouse: 'assets/warehouse.png' },
  translations: { 
    en: { navHome: 'Home', navNews: 'News', navShowcase: 'Features', navDownloads: 'Downloads', navSupport: 'Support', heroHeadline: 'Rule the Seas', heroSubheadline: 'Your adventure starts here.', heroBtnDownload: 'Get App', heroBtnLogs: 'Logs', newsTitle: 'News', newsSub: 'Latest', newsBtnRead: 'Read', showcaseTitle: 'Showcase', showcaseSub: 'Game', featMap: 'Map', featMapDesc: 'Desc', featRank: 'Rank', featRankDesc: 'Desc', featTasks: 'Tasks', featTasksDesc: 'Desc', featChat: 'Chat', featChatDesc: 'Desc', featStore: 'Store', featStoreDesc: 'Desc', featWarehouse: 'Safe', featWarehouseDesc: 'Desc', downloadTitle: 'Download', downloadSub: 'Now', downloadQuickDeploy: 'QR', downloadQuickDeploySub: 'Scan', supportTitle: 'Support', supportSub: 'Contact', supportBtnSend: 'Send', footerDesc: 'Asr Al Hamour', storeAppStore: 'App Store', storeGooglePlay: 'Google Play', storeBadge: 'Official' },
    ar: { navHome: 'الرئيسية', navNews: 'الأخبار', navShowcase: 'المميزات', navDownloads: 'التحميل', navSupport: 'الدعم', heroHeadline: 'سيطر على البحار', heroSubheadline: 'مغامرتك تبدأ من هنا.', heroBtnDownload: 'تحميل', heroBtnLogs: 'السجلات', newsTitle: 'الأخبار', newsSub: 'الأحدث', newsBtnRead: 'اقرأ', showcaseTitle: 'العرض', showcaseSub: 'اللعبة', featMap: 'خريطة', featMapDesc: 'وصف', featRank: 'ترتيب', featRankDesc: 'وصف', featTasks: 'مهام', featTasksDesc: 'وصف', featChat: 'دردشة', featChatDesc: 'وصف', featStore: 'متجر', featStoreDesc: 'وصف', featWarehouse: 'خزنة', featWarehouseDesc: 'وصف', downloadTitle: 'تحميل', downloadSub: 'الآن', downloadQuickDeploy: 'QR', downloadQuickDeploySub: 'امسح', supportTitle: 'الدعم', supportSub: 'اتصل', supportBtnSend: 'إرسال', footerDesc: 'عصر الهامور', storeAppStore: 'App Store', storeGooglePlay: 'Google Play', storeBadge: 'رسمي' }
  },
  socialLinks: {
    showSocials: true, whatsapp: '', whatsappGroup: '', telegram: '', discord: '', instagram: '', twitter: '', youtube: '', facebook: '', tiktok: '', snapchat: '',
    activeLinks: { whatsapp: true, whatsappGroup: true, telegram: true, discord: true, instagram: true, twitter: true, youtube: true, facebook: true, tiktok: true, snapchat: true }
  }
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<'site' | 'admin' | 'login'>('site');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('pirate_session'));
  const [lang, setLang] = useState<Language>('ar');
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);

  const loadData = async () => {
    try {
      const [s, t, n] = await Promise.all([
        apiService.getSettings(),
        apiService.getTickets(),
        apiService.getNews()
      ]);
      if (s) setSettings({ ...DEFAULT_SETTINGS, ...s }); 
      setTickets(t || []); 
      setNews(n || []);
    } catch (e) { 
      console.warn("Supabase fetch error, using defaults");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateSettings = async (ns: Partial<SiteSettings>) => {
    const updated = { ...settings, ...ns };
    setSettings(updated);
    try {
      await apiService.updateSettings(updated);
    } catch (err) {
      console.error("Supabase update failed", err);
    }
  };

  const login = (pass: string) => {
    if (pass === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('pirate_session', 'active');
      setCurrentPage('admin');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('pirate_session');
    setCurrentPage('site');
  };

  const navigateTo = (p: any) => {
    if (p === 'admin' && !isAuthenticated) setCurrentPage('login');
    else setCurrentPage(p);
    window.scrollTo(0, 0);
  };

  const translations = useMemo(() => settings.translations[lang] || settings.translations['ar'], [settings, lang]);

  return (
    <SettingsContext.Provider value={{ 
      settings, updateSettings, tickets, news, isLoading, currentPage, navigateTo,
      isAuthenticated, login, logout, lang, setLang, t: translations,
      addTicket: async (ticket) => { 
        await apiService.submitTicket(ticket); 
        const t = await apiService.getTickets();
        setTickets(t);
      },
      addNews: async (d) => { 
        await apiService.addNews(d); 
        const n = await apiService.getNews();
        setNews(n);
      },
      deleteNews: async (id) => { 
        await apiService.deleteNews(id); 
        setNews(prev => prev.filter(n => n.id !== id)); 
      },
      deleteTicket: async (id) => { 
        await apiService.deleteTicket(id); 
        setTickets(prev => prev.filter(t => t.id !== id)); 
      }
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const c = useContext(SettingsContext);
  if (!c) throw new Error('useSettings error');
  return c;
};
