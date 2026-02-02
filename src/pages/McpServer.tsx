import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter,
  Play,
  ArrowLeft,
  Server,
  Activity,
  Clock,
  Zap,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import mcpLogo from "@/assets/mcp-logo.svg";

const McpIcon = ({ className }: { className?: string }) => (
  <img src={mcpLogo} alt="MCP" className={className} />
);

export default function McpServer() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const mcpServers = [
    {
      id: "1",
      name: "RAN-MCP-001",
      description: "Radio Access Network Protocol Handler",
      status: "running",
      version: "2.1.0",
      lastPing: "2 sec ago",
      uptime: "99.9%",
      connections: 45,
      requests: "12.4k/hr"
    },
    {
      id: "2", 
      name: "Core-MCP-002",
      description: "Core Network Message Processor",
      status: "running",
      version: "2.0.5",
      lastPing: "1 sec ago",
      uptime: "99.8%",
      connections: 32,
      requests: "8.7k/hr"
    },
    {
      id: "3",
      name: "Edge-MCP-003", 
      description: "Edge Computing Protocol Bridge",
      status: "stopped",
      version: "1.9.2",
      lastPing: "5 min ago",
      uptime: "95.2%",
      connections: 0,
      requests: "0/hr"
    },
    {
      id: "4",
      name: "Analytics-MCP-004",
      description: "Data Analytics Protocol Server",
      status: "running",
      version: "2.1.0",
      lastPing: "3 sec ago",
      uptime: "99.7%",
      connections: 28,
      requests: "5.2k/hr"
    },
    {
      id: "5",
      name: "IoT-MCP-005",
      description: "IoT Device Protocol Handler",
      status: "maintenance",
      version: "2.0.8",
      lastPing: "1 min ago",
      uptime: "98.5%",
      connections: 12,
      requests: "2.1k/hr"
    }
  ];

  const statusOptions = [
    { id: "all", name: "All Status" },
    { id: "running", name: "Running" },
    { id: "stopped", name: "Stopped" },
    { id: "maintenance", name: "Maintenance" }
  ];

  const summaryStats = [
    {
      title: "Active Servers",
      value: "4",
      change: "2 high load",
      icon: () => <McpIcon className="w-5 h-5" />,
      color: "text-primary"
    },
    {
      title: "Total Connections",
      value: "117",
      change: "+12 today",
      icon: Server,
      color: "text-success"
    },
    {
      title: "Requests/Hour",
      value: "28.4k",
      change: "+5.2% vs avg",
      icon: Zap,
      color: "text-primary"
    },
    {
      title: "Avg Response",
      value: "12ms",
      change: "Excellent",
      icon: Activity,
      color: "text-success"
    }
  ];

  const filteredServers = mcpServers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         server.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || server.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-success text-success-foreground";
      case "stopped":
        return "bg-destructive text-destructive-foreground";
      case "maintenance":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <CheckCircle className="w-4 h-4" />;
      case "stopped":
        return <XCircle className="w-4 h-4" />;
      case "maintenance":
        return <RefreshCw className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MCP Server</h1>
          <p className="text-muted-foreground">Model Context Protocol server management and monitoring</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat) => (
          <Card key={stat.title} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
                <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search MCP servers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Server List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <McpIcon className="w-5 h-5" />
            MCP Server Instances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredServers.map((server) => (
              <div key={server.id} className="flex items-center justify-between p-4 rounded-lg border bg-secondary/20 hover:bg-secondary/40 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <McpIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{server.name}</p>
                      <Badge className={getStatusColor(server.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(server.status)}
                          {server.status}
                        </span>
                      </Badge>
                      <Badge variant="outline">v{server.version}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{server.description}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last ping: {server.lastPing}
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        Uptime: {server.uptime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Server className="w-3 h-3" />
                        {server.connections} connections
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">{server.requests}</p>
                    <p className="text-xs text-muted-foreground">requests</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Play className="w-3 h-3" />
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredServers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <McpIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No MCP servers found matching your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
