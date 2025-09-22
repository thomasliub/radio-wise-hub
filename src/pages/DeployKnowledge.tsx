import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Upload, 
  FileText,
  CheckCircle,
  ArrowLeft,
  Tag,
  Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DeployKnowledge() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeploying, setIsDeploying] = useState(false);

  const categories = [
    { id: "configuration", name: "Configuration", color: "bg-blue-500" },
    { id: "optimization", name: "Optimization", color: "bg-green-500" },
    { id: "troubleshooting", name: "Troubleshooting", color: "bg-red-500" },
    { id: "maintenance", name: "Maintenance", color: "bg-yellow-500" },
    { id: "deployment", name: "Deployment", color: "bg-purple-500" },
    { id: "monitoring", name: "Monitoring", color: "bg-orange-500" },
  ];

  const accessLevels = [
    { id: "public", name: "Public", description: "Accessible to all users" },
    { id: "internal", name: "Internal", description: "Ericsson employees only" },
    { id: "restricted", name: "Restricted", description: "Specific teams only" },
    { id: "confidential", name: "Confidential", description: "Senior engineers only" },
  ];

  const handleDeploy = async () => {
    setIsDeploying(true);
    // Simulate deployment process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsDeploying(false);
    
    toast({
      title: "Knowledge Article Deployed",
      description: "Your knowledge article is now available in the knowledge base.",
    });

    navigate("/knowledge");
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
          <h1 className="text-3xl font-bold tracking-tight">Deploy Knowledge</h1>
          <p className="text-muted-foreground">Add new documentation and knowledge articles to the knowledge base</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Article Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Article Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g., 5G NR Optimization Guide"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${category.color}`} />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accessLevel">Access Level</Label>
                  <Select defaultValue="internal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accessLevels.map((level) => (
                        <SelectItem key={level.id} value={level.id}>
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            {level.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input 
                  id="tags" 
                  placeholder="e.g., 5G, optimization, performance (comma separated)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea 
                  id="summary" 
                  placeholder="Brief description of the article content..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  placeholder="Write your article content here or upload files below..."
                  rows={8}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                File Attachments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drop files here or click to browse
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  Supported formats: PDF, DOC, DOCX, TXT, MD, Images
                </p>
                <Button variant="outline" size="sm">
                  Select Files
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">optimization-guide.pdf</span>
                  </div>
                  <Badge variant="outline">2.4 MB</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">network-diagram.png</span>
                  </div>
                  <Badge variant="outline">856 KB</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <span>Configuration</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Access Level:</span>
                  <span>Internal</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Attachments:</span>
                  <span>2 files</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="outline">Draft</Badge>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <Button 
                  className="w-full" 
                  onClick={handleDeploy}
                  disabled={isDeploying}
                >
                  {isDeploying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Publish Article
                    </>
                  )}
                </Button>
                <Button variant="outline" className="w-full">
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                  <div className={`w-3 h-3 rounded-full ${category.color}`} />
                  <span className="text-sm">{category.name}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Use clear, descriptive titles</p>
              <p>• Add relevant tags for searchability</p>
              <p>• Include code examples when applicable</p>
              <p>• Keep content up to date</p>
              <p>• Use proper formatting and structure</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}