import { DashboardStats } from "@/components/DashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Server, 
  Activity, 
  BookOpen, 
  ArrowRight, 
  TrendingUp,
  Users,
  Database
} from "lucide-react";

export default function Dashboard() {
  const recentAgents = [
    { id: "1", name: "RAN-Agent-001", status: "active", location: "Stockholm DC" },
    { id: "2", name: "RAN-Agent-002", status: "maintenance", location: "Helsinki DC" },
    { id: "3", name: "RAN-Agent-003", status: "active", location: "Oslo DC" },
  ];

  const recentKnowledge = [
    { title: "5G NR Configuration Guide", category: "Configuration", updated: "2 hours ago" },
    { title: "Radio Optimization Best Practices", category: "Optimization", updated: "4 hours ago" },
    { title: "Troubleshooting Network Issues", category: "Troubleshooting", updated: "1 day ago" },
  ];

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
            {recentAgents.map((agent) => (
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
                  className={agent.status === 'active' ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'}
                >
                  {agent.status}
                </Badge>
              </div>
            ))}
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
            {recentKnowledge.map((item, index) => (
              <div key={index} className="flex items-start justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors cursor-pointer">
                <div className="flex-1">
                  <p className="font-medium text-sm mb-1">{item.title}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{item.category}</Badge>
                    <span className="text-xs text-muted-foreground">Updated {item.updated}</span>
                  </div>
                </div>
              </div>
            ))}
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
            <Button className="h-auto p-4 flex-col gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Server className="w-6 h-6" />
              <div className="text-center">
                <p className="font-medium">Deploy Agent</p>
                <p className="text-xs opacity-90">Add new SW agent</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col gap-2 border-primary text-primary hover:bg-primary/5">
              <BookOpen className="w-6 h-6" />
              <div className="text-center">
                <p className="font-medium">Browse Knowledge</p>
                <p className="text-xs">Search documentation</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col gap-2 border-primary text-primary hover:bg-primary/5">
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