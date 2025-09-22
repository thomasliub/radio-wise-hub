import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Database, 
  Search, 
  Filter,
  Download,
  ArrowLeft,
  Server,
  Activity,
  Calendar,
  BarChart3,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ViewAgentData() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDataType, setSelectedDataType] = useState("all");

  const agentData = [
    {
      id: "1",
      agentName: "RAN-Agent-001",
      dataType: "Performance Metrics",
      lastUpdated: "2024-01-15 14:30",
      size: "2.4 MB",
      status: "active",
      location: "Stockholm DC",
      entries: 1250
    },
    {
      id: "2", 
      agentName: "RAN-Agent-002",
      dataType: "Configuration Data",
      lastUpdated: "2024-01-15 13:45",
      size: "856 KB",
      status: "maintenance",
      location: "Helsinki DC",
      entries: 340
    },
    {
      id: "3",
      agentName: "RAN-Agent-003", 
      dataType: "Log Files",
      lastUpdated: "2024-01-15 15:20",
      size: "5.2 MB",
      status: "active",
      location: "Oslo DC",
      entries: 2830
    },
    {
      id: "4",
      agentName: "RAN-Agent-001",
      dataType: "Alert History",
      lastUpdated: "2024-01-15 12:15",
      size: "1.1 MB", 
      status: "active",
      location: "Stockholm DC",
      entries: 487
    },
    {
      id: "5",
      agentName: "Coverage-Agent-001",
      dataType: "Coverage Maps",
      lastUpdated: "2024-01-15 11:30",
      size: "8.7 MB",
      status: "active",
      location: "London DC", 
      entries: 156
    }
  ];

  const dataTypes = [
    { id: "all", name: "All Data Types" },
    { id: "performance", name: "Performance Metrics" },
    { id: "configuration", name: "Configuration Data" },
    { id: "logs", name: "Log Files" },
    { id: "alerts", name: "Alert History" },
    { id: "coverage", name: "Coverage Maps" }
  ];

  const summaryStats = [
    {
      title: "Total Data Size",
      value: "18.2 MB",
      change: "+2.1 MB today",
      icon: Database,
      color: "text-primary"
    },
    {
      title: "Active Agents",
      value: "12",
      change: "4 reporting",
      icon: Server,
      color: "text-success"
    },
    {
      title: "Data Entries",
      value: "5,063",
      change: "+127 today",
      icon: BarChart3,
      color: "text-primary"
    },
    {
      title: "Last Update",
      value: "2 min ago",
      change: "Agent-003",
      icon: Activity,
      color: "text-success"
    }
  ];

  const filteredData = agentData.filter(item => {
    const matchesSearch = item.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.dataType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedDataType === "all" || 
                       item.dataType.toLowerCase().includes(selectedDataType.replace("performance", "performance metrics").replace("configuration", "configuration data").replace("logs", "log files").replace("alerts", "alert history").replace("coverage", "coverage maps"));
    return matchesSearch && matchesType;
  });

  const handleExport = (format: string) => {
    // Simulate export functionality
    console.log(`Exporting data as ${format}`);
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
          <h1 className="text-3xl font-bold tracking-tight">Agent Data</h1>
          <p className="text-muted-foreground">View and analyze static data from your SW agents</p>
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
                  placeholder="Search agents or data types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedDataType} onValueChange={setSelectedDataType}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dataTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Agent Data Repository
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredData.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border bg-secondary/20 hover:bg-secondary/40 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Server className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{item.agentName}</p>
                      <Badge className={item.status === 'active' ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'}>
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.dataType} • {item.location}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.lastUpdated}
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        {item.entries} entries
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.size}</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="w-3 h-3" />
                    Export
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No data found matching your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col gap-2"
              onClick={() => handleExport('csv')}
            >
              <BarChart3 className="w-6 h-6" />
              <div className="text-center">
                <p className="font-medium">CSV Export</p>
                <p className="text-xs text-muted-foreground">Spreadsheet format</p>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col gap-2"
              onClick={() => handleExport('json')}
            >
              <Database className="w-6 h-6" />
              <div className="text-center">
                <p className="font-medium">JSON Export</p>
                <p className="text-xs text-muted-foreground">Structured data</p>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col gap-2"
              onClick={() => handleExport('report')}
            >
              <TrendingUp className="w-6 h-6" />
              <div className="text-center">
                <p className="font-medium">PDF Report</p>
                <p className="text-xs text-muted-foreground">Formatted report</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}