import React from 'react';

// For App-level types
export type Theme = 'light' | 'dark';
export type Language = 'en' | 'ar';
export type Page = 'home' | 'mind' | 'work' | 'pricing' | 'connect' | 'partnerHub' | 'dashboard' | 'article';

// For Articles
export interface ArticleContentSection {
  heading?: string;
  image?: string;
  paragraphs: string[];
}

export interface Article {
  id: number;
  image: string;
  category: string;
  title: string;
  excerpt: string;
  content?: ArticleContentSection[];
}

// For User / Client Hub
export interface User {
  name: string;
  company: string;
  email: string;
  phone: string;
}

export interface Project {
  id: number;
  created_at?: string;
  title: string;
  description: string;
  project_type: string;
  sub_service: string;
  style: string;
  location: string;
  start_date: string;
  requirements?: string;
  status: 'Pending Approval' | 'In Progress' | 'Awaiting Feedback' | 'Completed';
  client_id: string;
  timeline?: {
    milestones: {
      name: string;
      date: string;
      status: 'completed' | 'pending';
    }[];
  };
  media_url?: string;
  media_type?: 'image' | 'video';
}

export interface FeedbackComment {
    id: number;
    project_id: number;
    user_id: string;
    comment_text: string;
    type: 'image' | 'video';
    version: number;
    timestamp?: number;
    position_x?: number;
    position_y?: number;
    created_at?: string;
}

// For Quote Calculator
export interface FormData {
  clientName: string;
  projectTitle: string;
  projectType: string;
  videoLength: string;
  shootingDays: string;
  services: string[];
  additionalDetails: string;
}

export interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface Quote {
  quoteNumber: string;
  date: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientCompany?: string;
  projectName: string;
  lineItems: LineItem[];
  subtotal: number;
  grandTotal: number;
  notes: string;
}

export type ServiceName = 'Photography' | 'Video Production' | 'Post Production' | '360 Tours' | 'Time Lapse' | 'Photogrammetry';

export interface QuoteFormData {
  engagementType: 'Project' | 'Retainer' | 'Training' | null;
  service: ServiceName | null;
  config: {
    // Project-based configs
    subService?: string;
    logistics?: string;
    delivery?: string;
    addons?: string[];
    [key: string]: any; // For other dynamic properties

    // Retainer-based configs
    hours?: number;
    retainerAddons?: string[];
  };
  contact: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
}
