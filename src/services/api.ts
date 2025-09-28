// API service functions for agents and knowledge base

// Types
export interface Agent {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  location: string;
  owner: string;
  lastUpdated: string;
}

export interface Knowledge {
  id: string;
  title: string;
  category: string;
  updated: string;
  owner: string;
  status: 'active' | 'inactive' | 'maintenance';
}

export interface DashboardStats {
  activeAgents: number;
  knowledgeArticles: number;
  systemHealth: number;
  alerts: number;
  agentChange: string;
  knowledgeChange: string;
  healthStatus: string;
  alertsResolved: string;
}

// Base API URL - replace with your actual API endpoint
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://api.example.com';

// Generic fetch function with error handling
async function apiRequest<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  
  return response.json();
}

// Agent API functions
export const agentApi = {
  getRecentAgents: (): Promise<Agent[]> => 
    apiRequest<Agent[]>('/agents/recent'),
  
  getAllAgents: (): Promise<Agent[]> => 
    apiRequest<Agent[]>('/agents'),
    
  getAgent: (id: string): Promise<Agent> => 
    apiRequest<Agent>(`/agents/${id}`),
};

// Knowledge API functions
export const knowledgeApi = {
  getRecentKnowledge: (): Promise<Knowledge[]> => 
    apiRequest<Knowledge[]>('/knowledge/recent'),
    
  getAllKnowledge: (): Promise<Knowledge[]> => 
    apiRequest<Knowledge[]>('/knowledge'),
    
  getKnowledge: (id: string): Promise<Knowledge> => 
    apiRequest<Knowledge>(`/knowledge/${id}`),
};

// Dashboard stats API
export const dashboardApi = {
  getStats: (): Promise<DashboardStats> => 
    apiRequest<DashboardStats>('/dashboard/stats'),
};