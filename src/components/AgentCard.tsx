import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Server, Activity, Settings, Eye } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  version: string;
  status: "active" | "inactive" | "maintenance";
  uptime: string;
  lastSeen: string;
  location: string;
}

interface AgentCardProps {
  agent: Agent;
  onViewDetails: (id: string) => void;
  onManageAgent: (id: string) => void;
}

export function AgentCard({ agent, onViewDetails, onManageAgent }: AgentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "inactive":
        return "bg-destructive text-destructive-foreground";
      case "maintenance":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return "🟢";
      case "inactive":
        return "🔴";
      case "maintenance":
        return "🟡";
      default:
        return "⚪";
    }
  };

  return (
    <Card className="shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Server className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{agent.name}</CardTitle>
              <p className="text-sm text-muted-foreground">v{agent.version}</p>
            </div>
          </div>
          <Badge className={getStatusColor(agent.status)}>
            <span className="mr-1">{getStatusIcon(agent.status)}</span>
            {agent.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Uptime</p>
            <p className="font-medium">{agent.uptime}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Seen</p>
            <p className="font-medium">{agent.lastSeen}</p>
          </div>
        </div>
        
        <div>
          <p className="text-muted-foreground text-sm">Location</p>
          <p className="font-medium">{agent.location}</p>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(agent.id)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => onManageAgent(agent.id)}
            className="flex-1"
          >
            <Settings className="w-4 h-4 mr-1" />
            Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}