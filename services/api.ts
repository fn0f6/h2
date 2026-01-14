
import { supabase } from './supabaseClient';
import { NewsItem, SupportTicket } from '../types';

export const apiService = {
  getSettings: async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single();
    
    if (error) {
      console.warn('Settings not found or DB not ready. Using local defaults.');
      return null;
    }
    return data;
  },

  updateSettings: async (settings: any) => {
    const { data, error } = await supabase
      .from('settings')
      .update(settings)
      .eq('id', 1);
    
    if (error) throw error;
    return data;
  },

  getTickets: async () => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) return [];
    return data;
  },

  submitTicket: async (ticket: any) => {
    const { data, error } = await supabase
      .from('tickets')
      .insert([{ ...ticket, createdAt: new Date().toISOString() }]);
    
    if (error) throw error;
    return data;
  },

  deleteTicket: async (id: number) => {
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  getNews: async () => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) return [];
    return data;
  },

  addNews: async (news: any) => {
    const { data, error } = await supabase
      .from('news')
      .insert([news]);
    
    if (error) throw error;
    return data;
  },

  deleteNews: async (id: string) => {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  uploadImage: async (file: File, folder: string = 'general') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('assets')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath);

    return publicUrl;
  }
};
