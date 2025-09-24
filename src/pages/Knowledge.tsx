import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BookOpen, FileText, Video, Download, ExternalLink, Settings } from "lucide-react";

const knowledgeArticles = [
  {
    id: "1",
    title: "5G NR Configuration Guide",
    description: "Complete guide for configuring 5G NR radio parameters and optimization",
    category: "Configuration",
    type: "Guide",
    lastUpdated: "2024-01-15",
    readTime: "15 min",
    tags: ["5G", "NR", "Configuration", "Radio"],
    difficulty: "Intermediate"
  },
  {
    id: "2", 
    title: "Radio Optimization Best Practices",
    description: "Industry best practices for optimizing radio performance and coverage",
    category: "Optimization",
    type: "Best Practice",
    lastUpdated: "2024-01-12",
    readTime: "20 min",
    tags: ["Optimization", "Performance", "Coverage"],
    difficulty: "Advanced"
  },
  {
    id: "3",
    title: "Troubleshooting Network Issues",
    description: "Step-by-step troubleshooting guide for common network problems",
    category: "Troubleshooting",
    type: "Troubleshooting",
    lastUpdated: "2024-01-10", 
    readTime: "12 min",
    tags: ["Troubleshooting", "Network", "Issues"],
    difficulty: "Beginner"
  },
  {
    id: "4",
    title: "Agent API Documentation", 
    description: "Complete API reference for Radio SW Agent integration",
    category: "API",
    type: "Documentation",
    lastUpdated: "2024-01-08",
    readTime: "25 min",
    tags: ["API", "Integration", "Documentation"],
    difficulty: "Advanced"
  },
  {
    id: "5",
    title: "Security Configuration Manual",
    description: "Security hardening and configuration guidelines for radio systems",
    category: "Security", 
    type: "Manual",
    lastUpdated: "2024-01-05",
    readTime: "18 min",
    tags: ["Security", "Configuration", "Hardening"],
    difficulty: "Intermediate"
  },
  {
    id: "6",
    title: "Performance Monitoring Setup",
    description: "How to set up comprehensive performance monitoring for your agents",
    category: "Monitoring",
    type: "Guide", 
    lastUpdated: "2024-01-03",
    readTime: "10 min",
    tags: ["Monitoring", "Performance", "Setup"],
    difficulty: "Beginner"
  }
];

export default function Knowledge() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredArticles = knowledgeArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter;
    const matchesType = typeFilter === "all" || article.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-success text-success-foreground";
      case "Intermediate": 
        return "bg-warning text-warning-foreground";
      case "Advanced":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const categories = [...new Set(knowledgeArticles.map(a => a.category))];
  const types = [...new Set(knowledgeArticles.map(a => a.type))];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Comprehensive documentation and guides for Radio SW Agents
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <BookOpen className="w-4 h-4 mr-2" />
          Request New Article
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search knowledge base..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <div>
              <p className="text-2xl font-bold">{knowledgeArticles.length}</p>
              <p className="text-sm text-muted-foreground">Total Articles</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-success" />
            <div>
              <p className="text-2xl font-bold">{categories.length}</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-warning" />
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Video Guides</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-accent" />
            <div>
              <p className="text-2xl font-bold">25</p>
              <p className="text-sm text-muted-foreground">Downloads</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Knowledge Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  {article.category}
                </Badge>
                <Badge className={getDifficultyColor(article.difficulty)}>
                  {article.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-lg font-semibold leading-tight">
                {article.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {article.description}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-1">
                {article.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                    {tag}
                  </Badge>
                ))}
                {article.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    +{article.tags.length - 3}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{article.readTime}</span>
                <span>Updated {article.lastUpdated}</span>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => navigate(`/knowledge/${article.id}`)}
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Read
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/knowledge/${article.id}/config`)}
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Manage
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">No articles match your search</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  );
}