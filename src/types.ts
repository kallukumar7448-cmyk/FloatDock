export interface AppVersion {
  app_name: string;
  version_name: string;
  version_code: number;
  description: string;
  download_url: string;
  force_update: boolean;
}

export interface AboutLinks {
  terms_url: string;
  faq_url: string;
  privacy_url: string;
  about_url: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  click_url: string;
  created_at: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  read_time: string;
  category: string;
}

export interface Screenshot {
  id: number;
  title: string;
  url: string;
  caption?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  unread: boolean;
  created_at: string;
}

export interface PublicSettings {
  home_hero: {
    home_tagline: string;
    home_description: string;
  };
  about_page: {
    description: string;
    developer_info: string;
  };
  faqs: FAQItem[];
  blog_posts: BlogPost[];
  screenshots: Screenshot[];
  about_links: AboutLinks;
  version: AppVersion;
}

export interface DashboardStats {
  total_messages: number;
  unread_messages: number;
  total_notifications: number;
  total_faqs: number;
  total_blogs: number;
  total_screenshots: number;
  app_version: AppVersion;
}
