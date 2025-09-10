import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AgentCard } from "@/components/AgentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter } from "lucide-react";

// Mock data for agents
const mockAgents = [{
  id: "1",
  name: "RAN-Agent-001",
  version: "2.1.3",
  status: "active" as const,
  uptime: "15d 8h 32m",
  lastSeen: "2 min ago",
  location: "Stockholm DC - Rack A12"
}, {
  id: "2",
  name: "RAN-Agent-002",
  version: "2.1.3",
  status: "maintenance" as const,
  uptime: "2d 4h 15m",
  lastSeen: "1 hour ago",
  location: "Helsinki DC - Rack B05"
}, {
  id: "3",
  name: "RAN-Agent-003",
  version: "2.1.2",
  status: "active" as const,
  uptime: "8d 12h 45m",
  lastSeen: "5 min ago",
  location: "Oslo DC - Rack C03"
}, {
  id: "4",
  name: "RAN-Agent-004",
  version: "2.1.3",
  status: "inactive" as const,
  uptime: "0d 0h 0m",
  lastSeen: "3 days ago",
  location: "Copenhagen DC - Rack D07"
}, {
  id: "5",
  name: "RAN-Agent-005",
  version: "2.1.1",
  status: "active" as const,
  uptime: "25d 3h 17m",
  lastSeen: "1 min ago",
  location: "Gothenburg DC - Rack E02"
}, {
  id: "6",
  name: "RAN-Agent-006",
  version: "2.1.3",
  status: "maintenance" as const,
  uptime: "5d 9h 28m",
  lastSeen: "30 min ago",
  location: "Malmö DC - Rack F11"
}];
export default function Agents() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const filteredAgents = mockAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || agent.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const handleViewDetails = (id: string) => {
    // Navigate to agent chat interface
    navigate(`/agents/${id}/chat`);
  };
  const handleManageAgent = (id: string) => {
    // Navigate to agent configuration page
    navigate(`/agents/${id}/config`);
  };
  const statusCounts = {
    active: mockAgents.filter(a => a.status === "active").length,
    inactive: mockAgents.filter(a => a.status === "inactive").length,
    maintenance: mockAgents.filter(a => a.status === "maintenance").length
  };
  return <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Radio SW Agents</h1>
          <p className="text-muted-foreground">Manage and monitor your Radio SW Agents across all data centers</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Deploy New Agent
        </Button>
      </div>

      {/* Status Summary */}
      <div className="flex flex-wrap gap-4">
        <Badge className={`px-4 py-2 text-sm cursor-pointer transition-all hover:scale-105 ${statusFilter === "active" ? "bg-success text-success-foreground ring-2 ring-success/50" : "bg-success/20 text-success hover:bg-success/30"}`} onClick={() => setStatusFilter(statusFilter === "active" ? "all" : "active")}>
          {statusCounts.active} Active
        </Badge>
        <Badge className={`px-4 py-2 text-sm cursor-pointer transition-all hover:scale-105 ${statusFilter === "inactive" ? "bg-destructive text-destructive-foreground ring-2 ring-destructive/50" : "bg-destructive/20 text-destructive hover:bg-destructive/30"}`} onClick={() => setStatusFilter(statusFilter === "inactive" ? "all" : "inactive")}>
          {statusCounts.inactive} Inactive  
        </Badge>
        <Badge className={`px-4 py-2 text-sm cursor-pointer transition-all hover:scale-105 ${statusFilter === "maintenance" ? "bg-warning text-warning-foreground ring-2 ring-warning/50" : "bg-warning/20 text-warning hover:bg-warning/30"}`} onClick={() => setStatusFilter(statusFilter === "maintenance" ? "all" : "maintenance")}>
          {statusCounts.maintenance} In Maintenance
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search agents by name or location..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map(agent => <AgentCard key={agent.id} agent={agent} onViewDetails={handleViewDetails} onManageAgent={handleManageAgent} />)}
      </div>

      {filteredAgents.length === 0 && <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No agents match your current filters</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filter criteria</p>
        </div>}
    </div>;
}