import { useNavigate } from "react-router-dom";
import { DashboardStats } from "@/components/DashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecentAgents } from "@/hooks/useAgents";
import { useRecentKnowledge } from "@/hooks/useKnowledge";
import { 
  Server, 
  Activity, 
  BookOpen, 
  ArrowRight, 
  TrendingUp,
  Users,
  Database,
  AlertCircle
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: recentAgents, isLoading: agentsLoading, error: agentsError } = useRecentAgents();
  const { data: recentKnowledge, isLoading: knowledgeLoading, error: knowledgeError } = useRecentKnowledge();

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your Ericsson Radio SW Agents portal. Monitor your agents and access knowledge base.
        </p>
      </div>

      {/* Stats Grid */}
      <DashboardStats />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Agents */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" />
              <CardTitle>Recent Agent Activity</CardTitle>
            </div>
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {agentsLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))
            ) : agentsError ? (
              <div className="flex items-center gap-2 text-destructive p-3">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm">Failed to load agents</p>
              </div>
            ) : recentAgents?.length ? (
              recentAgents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Server className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.location}</p>
                    </div>
                  </div>
                  <Badge 
                    className={agent.status === 'active' ? 'bg-success text-success-foreground' : agent.status === 'maintenance' ? 'bg-warning text-warning-foreground' : 'bg-secondary text-secondary-foreground'}
                  >
                    {agent.status}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center p-3">No recent agents found</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Knowledge */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <CardTitle>Recent Knowledge Updates</CardTitle>
            </div>
            <Button variant="ghost" size="sm">
              Browse All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {knowledgeLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="p-3 rounded-lg bg-secondary/50">
                  <Skeleton className="h-4 w-48 mb-2" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))
            ) : knowledgeError ? (
              <div className="flex items-center gap-2 text-destructive p-3">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm">Failed to load knowledge articles</p>
              </div>
            ) : recentKnowledge?.length ? (
              recentKnowledge.map((item) => (
                <div key={item.id} className="flex items-start justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors cursor-pointer">
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-1">{item.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{item.category}</Badge>
                      <span className="text-xs text-muted-foreground">Updated {item.updated}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center p-3">No recent knowledge articles found</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-auto p-4 flex-col gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => navigate("/agents/new/config")}
            >
              <Server className="w-6 h-6" />
              <div className="text-center">
                <p className="font-medium">Deploy Agent</p>
                <p className="text-xs opacity-90">Add new SW agent</p>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col gap-2 border-primary text-primary hover:bg-primary/5"
              onClick={() => navigate("/knowledge/config")}
            >
              <BookOpen className="w-6 h-6" />
              <div className="text-center">
                <p className="font-medium">Deploy Knowledge</p>
                <p className="text-xs">Add documentation</p>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col gap-2 border-primary text-primary hover:bg-primary/5"
              onClick={() => navigate("/view-agent-data")}
            >
              <Database className="w-6 h-6" />
              <div className="text-center">
                <p className="font-medium">View Agent Data</p>
                <p className="text-xs">Access static data</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}