import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, BookOpen, Activity, AlertCircle } from "lucide-react";

const stats = [
  {
    title: "Active Agents",
    value: "12",
    change: "+2 from last hour",
    icon: Server,
    color: "text-success",
    bgColor: "bg-success/10"
  },
  {
    title: "Knowledge Articles",
    value: "1,247",
    change: "+15 this week",
    icon: BookOpen,
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    title: "System Health",
    value: "98.5%",
    change: "Excellent",
    icon: Activity,
    color: "text-success",
    bgColor: "bg-success/10"
  },
  {
    title: "Alerts",
    value: "3",
    change: "2 resolved today",
    icon: AlertCircle,
    color: "text-warning",
    bgColor: "bg-warning/10"
  }
];

export function DashboardStats() {
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