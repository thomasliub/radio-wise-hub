import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AgentCard } from "@/components/AgentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, Filter, ChevronRight, FolderOpen, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

// Category structure with subcategories
interface Category {
  id: string;
  name: string;
  subcategories?: Category[];
}

const categoryStructure: Category[] = [
  {
    id: "all",
    name: "All Agents",
  },
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
  const [categorySearch, setCategorySearch] = useState("");
  const [agentSearch, setAgentSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categoryStructure.map((c) => c.id))
  );

  // Get all category IDs including subcategories for a given category
  const getAllCategoryIds = (category: Category): string[] => {
    const ids = [category.id];
    if (category.subcategories) {
      category.subcategories.forEach((sub) => {
        ids.push(...getAllCategoryIds(sub));
      });
    }
    return ids;
  };

  // Get agents for the selected category (including subcategories)
  const getAgentsForSelectedCategory = () => {
    if (selectedCategory === "all") {
      return mockAgents;
    }

    // Find the category and get all its IDs
    const findCategory = (cats: Category[], id: string): Category | null => {
      for (const cat of cats) {
        if (cat.id === id) return cat;
        if (cat.subcategories) {
          const found = findCategory(cat.subcategories, id);
          if (found) return found;
        }
      }
      return null;
    };

    const category = findCategory(categoryStructure, selectedCategory);
    if (!category) return [];

    const categoryIds = getAllCategoryIds(category);
    return mockAgents.filter((agent) => categoryIds.includes(agent.categoryId));
  };

  const filteredAgents = getAgentsForSelectedCategory().filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(agentSearch.toLowerCase()) ||
      agent.location.toLowerCase().includes(agentSearch.toLowerCase());
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

  const getCategoryAgentCount = (category: Category): number => {
    const categoryIds = getAllCategoryIds(category);
    return mockAgents.filter((agent) => categoryIds.includes(agent.categoryId)).length;
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

  // Filter categories based on search
  const filterCategories = (categories: Category[], search: string): Category[] => {
    if (!search) return categories;
    
    return categories.reduce<Category[]>((acc, cat) => {
      const matchesSearch = cat.name.toLowerCase().includes(search.toLowerCase());
      const filteredSubs = cat.subcategories 
        ? filterCategories(cat.subcategories, search)
        : [];
      
      if (matchesSearch || filteredSubs.length > 0) {
        acc.push({
          ...cat,
          subcategories: filteredSubs.length > 0 ? filteredSubs : cat.subcategories,
        });
      }
      return acc;
    }, []);
  };

  const filteredCategories = filterCategories(categoryStructure, categorySearch);

  const renderCategoryItem = (category: Category, level: number = 0) => {
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategory === category.id;
    const agentCount = getCategoryAgentCount(category);
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;

    return (
      <div key={category.id}>
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors",
            "hover:bg-muted/50",
            isSelected && "bg-primary/10 text-primary border-l-2 border-primary",
            level > 0 && "ml-4"
          )}
          onClick={() => setSelectedCategory(category.id)}
        >
          {hasSubcategories ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCategory(category.id);
              }}
              className="p-0.5 hover:bg-muted rounded"
            >
              <ChevronRight
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-200",
                  isExpanded && "rotate-90"
                )}
              />
            </button>
          ) : (
            <span className="w-5" />
          )}
          
          {isExpanded && hasSubcategories ? (
            <FolderOpen className="w-4 h-4 text-primary shrink-0" />
          ) : (
            <Folder className="w-4 h-4 text-muted-foreground shrink-0" />
          )}
          
          <span className={cn("text-sm truncate flex-1", isSelected && "font-medium")}>
            {category.name}
          </span>
          
          <Badge variant="secondary" className="text-xs shrink-0">
            {agentCount}
          </Badge>
        </div>

        {hasSubcategories && isExpanded && (
          <div className="mt-1">
            {category.subcategories!.map((sub) => renderCategoryItem(sub, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
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

      {/* Two-panel Layout */}
      <div className="flex gap-6 min-h-[600px]">
        {/* Left Panel - Category Tree */}
        <div className="w-72 shrink-0 border rounded-lg bg-card">
          <div className="p-4 border-b">
            <h2 className="text-sm font-semibold text-foreground mb-3">Categories</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>
          <ScrollArea className="h-[500px]">
            <div className="p-3 space-y-1">
              {filteredCategories.map((category) => renderCategoryItem(category))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Agents */}
        <div className="flex-1 border rounded-lg bg-card">
          <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search agents by name or location..."
                value={agentSearch}
                onChange={(e) => setAgentSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44">
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

          <ScrollArea className="h-[500px]">
            <div className="p-4">
              {filteredAgents.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredAgents.map((agent) => (
                    <AgentCard
                      key={agent.id}
                      agent={agent}
                      onViewDetails={handleViewDetails}
                      onManageAgent={handleManageAgent}
                    />
                  ))}
                </div>
              ) : (
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
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
