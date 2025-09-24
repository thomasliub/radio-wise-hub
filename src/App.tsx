import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import Knowledge from "./pages/Knowledge";
import AgentChat from "./pages/AgentChat";
import AgentConfig from "./pages/AgentConfig";
import KnowledgeDetail from "./pages/KnowledgeDetail";

import KnowledgeConfig from "./pages/KnowledgeConfig";
import ViewAgentData from "./pages/ViewAgentData";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/agents/:id/chat" element={<AgentChat />} />
            <Route path="/agents/:id/config" element={<AgentConfig />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
            <Route path="/knowledge/config" element={<KnowledgeConfig />} />
            <Route path="/knowledge/:id/config" element={<KnowledgeConfig />} />
            <Route path="/view-agent-data" element={<ViewAgentData />} />
            <Route path="/data" element={<div className="p-8 text-center text-muted-foreground">Agent Data view coming soon</div>} />
            <Route path="/monitoring" element={<div className="p-8 text-center text-muted-foreground">Monitoring view coming soon</div>} />
            <Route path="/settings" element={<div className="p-8 text-center text-muted-foreground">Settings view coming soon</div>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
