import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AgentCard } from "@/components/AgentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, Plus, Filter, ChevronRight, FolderOpen, Folder } from "lucide-react";

// Category structure with subcategories
interface Category {
  id: string;
  name: string;
  subcategories?: Category[];
}

const categoryStructure: Category[] = [
  {
    id: "nordic",
    name: "Nordic Region",
    subcategories: [
      { id: "nordic-sweden", name: "Sweden" },
      { id: "nordic-finland", name: "Finland" },
      { id: "nordic-norway", name: "Norway" },
      { id: "nordic-denmark", name: "Denmark" },
    ],
  },
  {
    id: "production",
    name: "Production",
    subcategories: [
      { id: "prod-primary", name: "Primary Sites" },
      { id: "prod-backup", name: "Backup Sites" },
    ],
  },
  {
    id: "testing",
    name: "Testing & Development",
  },
];

// Mock data for agents with category assignment
const mockAgents = [
  {
    id: "1",
    name: "RAN-Agent-000",
    version: "2.1.3",
    status: "active" as const,
    uptime: "15d 8h 32m",
    lastSeen: "2 min ago",
    location: "Stockholm DC - Rack A12",
    categoryId: "nordic-sweden",
  },
  {
    id: "2",
    name: "RAN-Agent-002",
    version: "2.1.3",
    status: "maintenance" as const,
    uptime: "2d 4h 15m",
    lastSeen: "1 hour ago",
    location: "Helsinki DC - Rack B05",
    categoryId: "nordic-finland",
  },
  {
    id: "3",
    name: "RAN-Agent-003",
    version: "2.1.2",
    status: "active" as const,
    uptime: "8d 12h 45m",
    lastSeen: "5 min ago",
    location: "Oslo DC - Rack C03",
    categoryId: "nordic-norway",
  },
  {
    id: "4",
    name: "RAN-Agent-004",
    version: "2.1.3",
    status: "inactive" as const,
    uptime: "0d 0h 0m",
    lastSeen: "3 days ago",
    location: "Copenhagen DC - Rack D07",
    categoryId: "nordic-denmark",
  },
  {
    id: "5",
    name: "RAN-Agent-005",
    version: "2.1.1",
    status: "active" as const,
    uptime: "25d 3h 17m",
    lastSeen: "1 min ago",
    location: "Gothenburg DC - Rack E02",
    categoryId: "prod-primary",
  },
  {
    id: "6",
    name: "RAN-Agent-006",
    version: "2.1.3",
    status: "maintenance" as const,
    uptime: "5d 9h 28m",
    lastSeen: "30 min ago",
    location: "Malmö DC - Rack F11",
    categoryId: "prod-backup",
  },
  {
    id: "7",
    name: "RAN-Agent-007",
    version: "2.0.9",
    status: "active" as const,
    uptime: "3d 2h 10m",
    lastSeen: "10 min ago",
    location: "Test Lab - Virtual",
    categoryId: "testing",
  },
];

export default function Agents() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categoryStructure.map((c) => c.id))
  );

  const filteredAgents = mockAgents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const getAgentsForCategory = (categoryId: string) => {
    return filteredAgents.filter((agent) => agent.categoryId === categoryId);
  };

  const getCategoryAgentCount = (category: Category): number => {
    let count = getAgentsForCategory(category.id).length;
    if (category.subcategories) {
      count += category.subcategories.reduce(
        (sum, sub) => sum + getAgentsForCategory(sub.id).length,
        0
      );
    }
    return count;
  };

  const handleViewDetails = (id: string) => {
    navigate(`/agents/${id}/chat`);
  };

  const handleManageAgent = (id: string) => {
    navigate(`/agents/${id}/config`);
  };

  const statusCounts = {
    active: mockAgents.filter((a) => a.status === "active").length,
    inactive: mockAgents.filter((a) => a.status === "inactive").length,
    maintenance: mockAgents.filter((a) => a.status === "maintenance").length,
  };

  const renderCategorySection = (category: Category, level: number = 0) => {
    const isExpanded = expandedCategories.has(category.id);
    const directAgents = getAgentsForCategory(category.id);
    const totalCount = getCategoryAgentCount(category);
    const hasContent = totalCount > 0 || category.subcategories;

    if (totalCount === 0 && !category.subcategories) {
      return null;
    }

    return (
      <div key={category.id} className={`${level > 0 ? "ml-6" : ""}`}>
        <Collapsible open={isExpanded} onOpenChange={() => toggleCategory(category.id)}>
          <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 rounded-lg hover:bg-muted/50 transition-colors group">
            <ChevronRight
              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
            {isExpanded ? (
              <FolderOpen className="w-5 h-5 text-primary" />
            ) : (
              <Folder className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
            )}
            <span className="font-medium text-foreground">{category.name}</span>
            <Badge variant="secondary" className="ml-auto">
              {totalCount} agent{totalCount !== 1 ? "s" : ""}
            </Badge>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-2">
            {/* Subcategories */}
            {category.subcategories && (
              <div className="space-y-1">
                {category.subcategories.map((sub) => renderCategorySection(sub, level + 1))}
              </div>
            )}

            {/* Direct agents in this category */}
            {directAgents.length > 0 && (
              <div
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3 ${
                  level > 0 ? "ml-6" : ""
                }`}
              >
                {directAgents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    onViewDetails={handleViewDetails}
                    onManageAgent={handleManageAgent}
                  />
                ))}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Radio SW Agents
          </h1>
          <p className="text-muted-foreground">
            Manage and monitor your Radio SW Agents across all data centers
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Deploy New Agent
        </Button>
      </div>

      {/* Status Summary */}
      <div className="flex flex-wrap gap-4">
        <Badge
          className={`px-4 py-2 text-sm cursor-pointer transition-all hover:scale-105 ${
            statusFilter === "active"
              ? "bg-success text-success-foreground ring-2 ring-success/50"
              : "bg-success/20 text-success hover:bg-success/30"
          }`}
          onClick={() => setStatusFilter(statusFilter === "active" ? "all" : "active")}
        >
          {statusCounts.active} Active
        </Badge>
        <Badge
          className={`px-4 py-2 text-sm cursor-pointer transition-all hover:scale-105 ${
            statusFilter === "inactive"
              ? "bg-destructive text-destructive-foreground ring-2 ring-destructive/50"
              : "bg-destructive/20 text-destructive hover:bg-destructive/30"
          }`}
          onClick={() => setStatusFilter(statusFilter === "inactive" ? "all" : "inactive")}
        >
          {statusCounts.inactive} Inactive
        </Badge>
        <Badge
          className={`px-4 py-2 text-sm cursor-pointer transition-all hover:scale-105 ${
            statusFilter === "maintenance"
              ? "bg-warning text-warning-foreground ring-2 ring-warning/50"
              : "bg-warning/20 text-warning hover:bg-warning/30"
          }`}
          onClick={() =>
            setStatusFilter(statusFilter === "maintenance" ? "all" : "maintenance")
          }
        >
          {statusCounts.maintenance} In Maintenance
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search agents by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
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

      {/* Category Tree with Agents */}
      <div className="space-y-2 border rounded-lg p-4 bg-card">
        <h2 className="text-lg font-semibold mb-4 text-foreground">Agent Categories</h2>
        <div className="space-y-1">
          {categoryStructure.map((category) => renderCategorySection(category))}
        </div>
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No agents match your current filters
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
