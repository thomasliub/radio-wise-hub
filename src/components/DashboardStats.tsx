import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Server, BookOpen, Activity, AlertCircle } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboard";

export function DashboardStats() {
  const { data: statsData, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm">Failed to load dashboard statistics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      title: "Active Agents",
      value: statsData?.activeAgents?.toString() || "0",
      change: statsData?.agentChange || "No data",
      icon: Server,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Knowledge Articles", 
      value: statsData?.knowledgeArticles?.toLocaleString() || "0",
      change: statsData?.knowledgeChange || "No data",
      icon: BookOpen,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "System Health",
      value: statsData?.systemHealth ? `${statsData.systemHealth}%` : "0%",
      change: statsData?.healthStatus || "Unknown",
      icon: Activity,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "Alerts",
      value: statsData?.alerts?.toString() || "0",
      change: statsData?.alertsResolved || "No data",
      icon: AlertCircle,
      color: "text-warning",
      bgColor: "bg-warning/10"
    }
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="shadow-card hover:shadow-elegant transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}