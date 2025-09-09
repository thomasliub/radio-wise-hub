import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, User, Calendar, Download, Share, Bookmark } from "lucide-react";

interface KnowledgeArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  lastUpdated: string;
  readTime: string;
  tags: string[];
  difficulty: string;
  author: string;
  content: string;
  downloads: number;
  views: number;
  related: string[];
}

export default function KnowledgeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<KnowledgeArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        // Example API call to fetch detailed knowledge article
        const response = await fetch(`/api/knowledge/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Expected response structure:
        // {
        //   id: "1",
        //   title: "5G NR Configuration Guide",
        //   description: "Complete guide for configuring 5G NR radio parameters...",
        //   category: "Configuration",
        //   type: "Guide",
        //   lastUpdated: "2024-01-15",
        //   readTime: "15 min",
        //   tags: ["5G", "NR", "Configuration", "Radio"],
        //   difficulty: "Intermediate",
        //   author: "John Smith",
        //   content: "Full article content in markdown or HTML...",
        //   downloads: 1234,
        //   views: 5678,
        //   related: ["2", "3", "4"] // IDs of related articles
        // }
        
        setArticle(data);
      } catch (error) {
        console.error("Failed to fetch article:", error);
        // Fallback to mock data for demo
        setArticle({
          id: id || '1',
          title: '5G NR Configuration Guide',
          description: 'Complete guide for configuring 5G NR radio parameters and optimization',
          category: 'Configuration',
          type: 'Guide',
          lastUpdated: '2024-01-15',
          readTime: '15 min',
          tags: ['5G', 'NR', 'Configuration', 'Radio'],
          difficulty: 'Intermediate',
          author: 'John Smith',
          content: `# 5G NR Configuration Guide

## Introduction

This comprehensive guide covers the essential aspects of configuring 5G New Radio (NR) parameters for optimal performance in Ericsson Radio SW environments.

## Prerequisites

Before starting with 5G NR configuration, ensure you have:
- Basic understanding of cellular network architecture
- Access to the Radio SW Agent management interface
- Proper authentication credentials

## Configuration Steps

### 1. Initial Setup

Start by accessing the agent configuration panel:

\`\`\`bash
# Access the configuration interface
radio-sw-agent --config-mode
\`\`\`

### 2. Band Configuration

Configure the frequency bands according to your deployment:

\`\`\`json
{
  "bands": {
    "n78": {
      "frequency": "3500MHz",
      "bandwidth": "100MHz",
      "power": "40dBm"
    }
  }
}
\`\`\`

### 3. Performance Optimization

Key parameters for optimal performance:

- **Transmission Power**: Set according to coverage requirements
- **Bandwidth**: Optimize based on traffic patterns
- **Beam Management**: Configure for maximum efficiency

## Best Practices

1. **Regular Monitoring**: Continuously monitor KPIs
2. **Load Balancing**: Distribute traffic evenly
3. **Power Management**: Optimize for energy efficiency

## Troubleshooting

Common issues and solutions:

### Connection Issues
- Check network connectivity
- Verify authentication tokens
- Review firewall settings

### Performance Degradation
- Monitor resource utilization
- Check for interference
- Review configuration parameters

## Conclusion

Proper 5G NR configuration is crucial for network performance. Follow these guidelines and monitor your deployment regularly for optimal results.

For additional support, contact the Radio SW team or consult the advanced configuration documentation.`,
          downloads: 1234,
          views: 5678,
          related: ['2', '3', '4']
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

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

  const handleDownload = () => {
    // Implement download functionality
    console.log("Download article:", id);
  };

  const handleShare = () => {
    // Implement share functionality
    navigator.clipboard.writeText(window.location.href);
  };

  const handleBookmark = () => {
    // Implement bookmark functionality
    console.log("Bookmark article:", id);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading article...</div>;
  }

  if (!article) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Article not found</p>
        <Button 
          variant="outline" 
          onClick={() => navigate("/knowledge")}
          className="mt-4"
        >
          Back to Knowledge Base
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/knowledge")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Knowledge Base
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleBookmark}>
            <Bookmark className="w-4 h-4 mr-2" />
            Bookmark
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{article.category}</Badge>
                <Badge className={getDifficultyColor(article.difficulty)}>
                  {article.difficulty}
                </Badge>
                <Badge variant="secondary">{article.type}</Badge>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {article.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {article.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {article.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Updated {article.lastUpdated}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {article.readTime} read
                </div>
              </div>

              <Separator />
            </CardHeader>
            
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {article.content}
                  </pre>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Article Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Article Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Views</span>
                <span className="font-medium">{article.views.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Downloads</span>
                <span className="font-medium">{article.downloads.toLocaleString()}</span>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Related Articles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {article.related.map((relatedId) => (
                <div 
                  key={relatedId}
                  className="p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => navigate(`/knowledge/${relatedId}`)}
                >
                  <p className="text-sm font-medium">
                    Related Article {relatedId}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Configuration • 8 min read
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}