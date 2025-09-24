import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Save,
  Settings
} from "lucide-react";

const statusOptions = [
  { value: "active", label: "Active", color: "bg-success" },
  { value: "inactive", label: "Inactive", color: "bg-muted" },
  { value: "maintenance", label: "Maintenance", color: "bg-warning" }
];

const accessRoles = [
  "System Administrator",
  "Network Engineer", 
  "Radio Engineer",
  "Support Engineer",
  "Field Technician",
  "Manager",
  "Guest User"
];

const categories = [
  { id: "configuration", name: "Configuration", color: "bg-blue-500" },
  { id: "optimization", name: "Optimization", color: "bg-green-500" },
  { id: "troubleshooting", name: "Troubleshooting", color: "bg-red-500" },
  { id: "maintenance", name: "Maintenance", color: "bg-yellow-500" },
  { id: "deployment", name: "Deployment", color: "bg-purple-500" },
  { id: "monitoring", name: "Monitoring", color: "bg-orange-500" },
];

export default function KnowledgeConfig() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEdit = !!id;
  
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: {
      purpose: "",
      content: "",
      workflow: "",
      maintenance: ""
    },
    status: "active",
    owner: "",
    accessRoles: [] as string[],
    category: "",
    tags: "",
    summary: "",
    content: "",
    lastUpdated: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (isEdit && id) {
      // Load existing knowledge base data
      setFormData({
        name: "5G NR Configuration Guide",
        description: {
          purpose: "This knowledge base provides comprehensive guidance for configuring 5G NR radio parameters and optimization techniques for optimal network performance.",
          content: "Contains step-by-step configuration procedures, parameter explanations, optimization strategies, and troubleshooting guides for 5G NR deployments.",
          workflow: "To be used during initial network deployment, performance optimization phases, and routine maintenance activities. Integrate with existing monitoring tools for best results.",
          maintenance: "Updated quarterly by the Radio Engineering team. Content reviewed monthly for accuracy. Deprecated procedures are archived and marked accordingly."
        },
        status: "active",
        owner: "Radio Engineering Team",
        accessRoles: ["System Administrator", "Network Engineer", "Radio Engineer"],
        category: "configuration",
        tags: "5G, NR, Configuration, Radio",
        summary: "Complete guide for configuring 5G NR radio parameters and optimization",
        content: "# 5G NR Configuration Guide\n\nThis comprehensive guide covers all aspects of 5G NR configuration...",
        lastUpdated: "2024-01-15"
      });
    }
  }, [isEdit, id]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    
    toast({
      title: isEdit ? "Knowledge Base Updated" : "Knowledge Base Created",
      description: isEdit 
        ? "Knowledge base configuration has been updated successfully."
        : "New knowledge base has been created and is now available.",
    });

    navigate("/knowledge");
  };

  const handleAccessRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      accessRoles: prev.accessRoles.includes(role)
        ? prev.accessRoles.filter(r => r !== role)
        : [...prev.accessRoles, role]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/knowledge")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Knowledge Base
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit ? "Configure Knowledge Base" : "Create Knowledge Base"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? "Modify knowledge base configuration and settings" : "Set up a new knowledge base with detailed configuration"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Knowledge Base Name *</Label>
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., 5G NR Configuration Guide"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
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
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${option.color}`} />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner">Owner</Label>
                <Input 
                  id="owner"
                  value={formData.owner}
                  onChange={(e) => setFormData(prev => ({ ...prev, owner: e.target.value }))}
                  placeholder="e.g., Radio Engineering Team"
                />
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Detailed Description (Markdown)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of the Knowledge Base</Label>
                <Textarea 
                  id="purpose"
                  value={formData.description.purpose}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    description: { ...prev.description, purpose: e.target.value }
                  }))}
                  placeholder="Describe the purpose and objectives of this knowledge base..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content-desc">Content Description</Label>
                <Textarea 
                  id="content-desc"
                  value={formData.description.content}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    description: { ...prev.description, content: e.target.value }
                  }))}
                  placeholder="Describe what content is included in this knowledge base..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workflow">How to Use in Workflow</Label>
                <Textarea 
                  id="workflow"
                  value={formData.description.workflow}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    description: { ...prev.description, workflow: e.target.value }
                  }))}
                  placeholder="Explain how this knowledge base should be used in daily workflows..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenance-policy">Maintenance Policy</Label>
                <Textarea 
                  id="maintenance-policy"
                  value={formData.description.maintenance}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    description: { ...prev.description, maintenance: e.target.value }
                  }))}
                  placeholder="Define the maintenance schedule, update procedures, and responsibilities..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Access Control */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Access Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Access Roles</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {accessRoles.map((role) => (
                    <div 
                      key={role}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.accessRoles.includes(role) 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleAccessRoleToggle(role)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          formData.accessRoles.includes(role) 
                            ? 'border-primary bg-primary' 
                            : 'border-border'
                        }`}>
                          {formData.accessRoles.includes(role) && (
                            <CheckCircle className="w-3 h-3 text-primary-foreground" />
                          )}
                        </div>
                        <span className="text-sm">{role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={formData.status === "active" ? "default" : "secondary"}>
                    {statusOptions.find(s => s.value === formData.status)?.label}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <span>{categories.find(c => c.id === formData.category)?.name || "Not selected"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Owner:</span>
                  <span>{formData.owner || "Not specified"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Access Roles:</span>
                  <span>{formData.accessRoles.length} selected</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{formData.lastUpdated}</span>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <Button 
                  className="w-full" 
                  onClick={handleSave}
                  disabled={isSaving || !formData.name}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isEdit ? "Update Configuration" : "Create Knowledge Base"}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Selected Access Roles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {formData.accessRoles.length > 0 ? (
                formData.accessRoles.map((role) => (
                  <div key={role} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">{role}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No access roles selected</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}