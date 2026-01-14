
export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  thumbnailUrl: string;
  category: string;
}

export interface SupportTicket {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: number; // Timestamp
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
