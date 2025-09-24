import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Save, RotateCcw, Settings, Trash2, Bot, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface AgentConfig {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "maintenance";
  owner: string;
  accessRoles: string[];
  lastUpdated: string;
  agentType: "langflow" | "custom";
  langflowConfig?: {
    flowId: string;
    apiKey: string;
    baseUrl: string;
    maxTokens?: number;
    streamMode?: boolean;
    temperature?: number;
  };
  customConfig?: {
    iframeUrl: string;
  };
}

export default function AgentConfig() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [config, setConfig] = useState<AgentConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const isNewAgent = id === 'new';

  useEffect(() => {
    if (isNewAgent) {
      // Create new agent configuration
      setConfig({
        id: 'new',
        name: '',
        description: '',
        status: 'inactive',
        owner: '',
        accessRoles: ['user'],
        lastUpdated: new Date().toISOString(),
        agentType: 'langflow',
        langflowConfig: {
          flowId: '',
          apiKey: '',
          baseUrl: '',
          maxTokens: 2048,
          streamMode: false,
          temperature: 0.7
        }
      });
      setHasChanges(true); // New agent should be saveable
    } else {
      // Simulate fetching existing agent configuration
      setConfig({
        id: id || '1',
        name: `AI Agent ${id?.padStart(3, '0')}`,
        description: 'A powerful AI agent for automated tasks and intelligent assistance.',
        status: 'active',
        owner: 'John Doe',
        accessRoles: ['admin', 'user'],
        lastUpdated: new Date().toISOString(),
        agentType: 'langflow',
        langflowConfig: {
          flowId: 'flow-12345',
          apiKey: '',
          baseUrl: 'https://api.langflow.example.com',
          maxTokens: 2048,
          streamMode: true,
          temperature: 0.7
        }
      });
    }
  }, [id, isNewAgent]);

  const updateBasicConfig = (key: keyof AgentConfig, value: any) => {
    if (!config) return;
    
    setConfig(prev => ({
      ...prev!,
      [key]: value
    }));
    setHasChanges(true);
  };

  const updateLangflowConfig = (key: string, value: any) => {
    if (!config || !config.langflowConfig) return;
    
    setConfig(prev => ({
      ...prev!,
      langflowConfig: {
        ...prev!.langflowConfig!,
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const updateCustomConfig = (key: string, value: any) => {
    if (!config) return;
    
    setConfig(prev => ({
      ...prev!,
      customConfig: {
        ...prev!.customConfig,
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleAgentTypeChange = (newType: "langflow" | "custom") => {
    if (!config) return;
    
    setConfig(prev => ({
      ...prev!,
      agentType: newType,
      langflowConfig: newType === 'langflow' ? (prev!.langflowConfig || {
        flowId: '',
        apiKey: '',
        baseUrl: '',
        maxTokens: 2048,
        streamMode: false,
        temperature: 0.7
      }) : undefined,
      customConfig: newType === 'custom' ? (prev!.customConfig || {
        iframeUrl: ''
      }) : undefined
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!config) return;
    
    setIsLoading(true);
    try {
      const method = isNewAgent ? 'POST' : 'PUT';
      const url = isNewAgent ? '/api/agents' : `/api/agents/${id}/config`;
      
      // Example API call to save configuration
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          ...config,
          lastUpdated: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedAgent = await response.json();

      toast({
        title: isNewAgent ? "Agent Created" : "Configuration Saved",
        description: isNewAgent 
          ? "New agent has been created successfully." 
          : "Agent configuration has been updated successfully.",
      });
      
      setHasChanges(false);
      
      if (isNewAgent && savedAgent.id) {
        // Redirect to the newly created agent's config page
        navigate(`/agents/${savedAgent.id}/config`);
      }
    } catch (error) {
      console.error("Failed to save configuration:", error);
      toast({
        title: "Save Failed",
        description: `Failed to ${isNewAgent ? 'create' : 'save'} agent configuration. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // Reset to original values - in real app, would fetch from server
    if (config) {
      setConfig({
        id: id || '1',
        name: `AI Agent ${id?.padStart(3, '0')}`,
        description: 'A powerful AI agent for automated tasks and intelligent assistance.',
        status: 'active',
        owner: 'John Doe',
        accessRoles: ['admin', 'user'],
        lastUpdated: new Date().toISOString(),
        agentType: 'langflow',
        langflowConfig: {
          flowId: 'flow-12345',
          apiKey: '',
          baseUrl: 'https://api.langflow.example.com',
          maxTokens: 2048,
          streamMode: true,
          temperature: 0.7
        }
      });
      setHasChanges(false);
    }
  };

  const handleDelete = async () => {
    if (!config) return;
    
    setIsDeleting(true);
    try {
      // Example API call to delete agent
      const response = await fetch(`/api/agents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Agent Deleted",
        description: "The agent has been successfully deleted.",
      });
      
      navigate("/agents");
    } catch (error) {
      console.error("Failed to delete agent:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!config) {
    return <div className="flex items-center justify-center h-96">Loading configuration...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/agents")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Agents
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {isNewAgent ? 'Deploy New Agent' : `${config.name} Configuration`}
              </h1>
              <div className="flex items-center gap-2">
            <Badge variant={config.status === 'active' ? 'default' : config.status === 'inactive' ? 'secondary' : 'destructive'}>
              {config.status.charAt(0).toUpperCase() + config.status.slice(1)}
            </Badge>
            <span className="text-sm text-muted-foreground">Owner: {config.owner}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">Updated: {new Date(config.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {!isNewAgent && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Agent
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Agent</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{config.name}"? This action cannot be undone and will permanently remove the agent and all its configuration.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Agent'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          {!isNewAgent && (
            <Button 
              variant="outline" 
              onClick={handleReset}
              disabled={!hasChanges || isLoading}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}
          <Button 
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? (isNewAgent ? 'Creating...' : 'Saving...') : (isNewAgent ? 'Create Agent' : 'Save Changes')}
          </Button>
        </div>
      </div>

      {/* Configuration */}
      <div className="grid gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={config.name}
                  onChange={(e) => updateBasicConfig('name', e.target.value)}
                  placeholder="Enter agent name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="owner">Owner</Label>
                <Input
                  id="owner"
                  value={config.owner}
                  onChange={(e) => updateBasicConfig('owner', e.target.value)}
                  placeholder="Enter owner name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={config.description}
                onChange={(e) => updateBasicConfig('description', e.target.value)}
                placeholder="Enter agent description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={config.status}
                  onValueChange={(value) => updateBasicConfig('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">In Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessRoles">Access Roles</Label>
                <Input
                  id="accessRoles"
                  value={config.accessRoles.join(', ')}
                  onChange={(e) => updateBasicConfig('accessRoles', e.target.value.split(',').map(role => role.trim()).filter(role => role))}
                  placeholder="admin, user, viewer"
                />
                <p className="text-sm text-muted-foreground">Comma-separated list of roles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agent Type Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Agent Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Agent Type</Label>
              <RadioGroup
                value={config.agentType}
                onValueChange={handleAgentTypeChange}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="langflow" id="langflow" />
                  <Label htmlFor="langflow" className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    Langflow Agent
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Custom Deployment
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {config.agentType === 'langflow' && config.langflowConfig && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Langflow Configuration</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="flowId">Flow ID *</Label>
                    <Input
                      id="flowId"
                      value={config.langflowConfig.flowId}
                      onChange={(e) => updateLangflowConfig('flowId', e.target.value)}
                      placeholder="Enter Langflow Flow ID"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="baseUrl">Base URL *</Label>
                    <Input
                      id="baseUrl"
                      value={config.langflowConfig.baseUrl}
                      onChange={(e) => updateLangflowConfig('baseUrl', e.target.value)}
                      placeholder="https://api.langflow.example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key *</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={config.langflowConfig.apiKey}
                    onChange={(e) => updateLangflowConfig('apiKey', e.target.value)}
                    placeholder="Enter API key"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxTokens">Max Tokens</Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      value={config.langflowConfig.maxTokens || ''}
                      onChange={(e) => updateLangflowConfig('maxTokens', e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="2048"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      value={config.langflowConfig.temperature || ''}
                      onChange={(e) => updateLangflowConfig('temperature', e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder="0.7"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-6">
                    <div className="space-y-1">
                      <Label>Stream Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable streaming responses</p>
                    </div>
                    <Switch
                      checked={config.langflowConfig.streamMode || false}
                      onCheckedChange={(value) => updateLangflowConfig('streamMode', value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {config.agentType === 'custom' && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Custom Deployment Configuration</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="iframeUrl">Iframe URL *</Label>
                  <Input
                    id="iframeUrl"
                    value={config.customConfig?.iframeUrl || ''}
                    onChange={(e) => updateCustomConfig('iframeUrl', e.target.value)}
                    placeholder="https://your-agent-deployment.com"
                  />
                  <p className="text-sm text-muted-foreground">URL to embed your custom agent interface</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}