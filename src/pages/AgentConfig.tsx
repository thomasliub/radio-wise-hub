import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, RotateCcw, Settings, Network, Shield, Activity, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface AgentConfig {
  id: string;
  name: string;
  version: string;
  status: "active" | "inactive" | "maintenance";
  location: string;
  configuration: {
    general: {
      autoStart: boolean;
      logLevel: string;
      heartbeatInterval: number;
      maxRetries: number;
    };
    network: {
      port: number;
      protocol: string;
      timeout: number;
      compression: boolean;
    };
    security: {
      encryption: boolean;
      authRequired: boolean;
      sslEnabled: boolean;
      certificatePath: string;
    };
    monitoring: {
      metricsEnabled: boolean;
      loggingEnabled: boolean;
      alertThreshold: number;
      reportingInterval: number;
    };
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

  useEffect(() => {
    // Simulate fetching agent configuration
    setConfig({
      id: id || '1',
      name: `RAN-Agent-${id?.padStart(3, '0')}`,
      version: '2.1.3',
      status: 'active',
      location: 'Stockholm DC - Rack A12',
      configuration: {
        general: {
          autoStart: true,
          logLevel: 'INFO',
          heartbeatInterval: 30,
          maxRetries: 3
        },
        network: {
          port: 8080,
          protocol: 'HTTPS',
          timeout: 5000,
          compression: true
        },
        security: {
          encryption: true,
          authRequired: true,
          sslEnabled: true,
          certificatePath: '/etc/ssl/certs/agent.crt'
        },
        monitoring: {
          metricsEnabled: true,
          loggingEnabled: true,
          alertThreshold: 90,
          reportingInterval: 60
        }
      }
    });
  }, [id]);

  const updateConfig = (section: keyof AgentConfig['configuration'], key: string, value: any) => {
    if (!config) return;
    
    setConfig(prev => ({
      ...prev!,
      configuration: {
        ...prev!.configuration,
        [section]: {
          ...prev!.configuration[section],
          [key]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!config) return;
    
    setIsLoading(true);
    try {
      // Example API call to save configuration
      const response = await fetch(`/api/agents/${id}/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          configuration: config.configuration
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Configuration Saved",
        description: "Agent configuration has been updated successfully.",
      });
      
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save configuration:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save agent configuration. Please try again.",
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
        ...config,
        configuration: {
          general: {
            autoStart: true,
            logLevel: 'INFO',
            heartbeatInterval: 30,
            maxRetries: 3
          },
          network: {
            port: 8080,
            protocol: 'HTTPS',
            timeout: 5000,
            compression: true
          },
          security: {
            encryption: true,
            authRequired: true,
            sslEnabled: true,
            certificatePath: '/etc/ssl/certs/agent.crt'
          },
          monitoring: {
            metricsEnabled: true,
            loggingEnabled: true,
            alertThreshold: 90,
            reportingInterval: 60
          }
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
              <h1 className="text-2xl font-bold text-foreground">{config.name} Configuration</h1>
              <div className="flex items-center gap-2">
                <Badge className="bg-success text-success-foreground">
                  <Activity className="w-3 h-3 mr-1" />
                  {config.status}
                </Badge>
                <span className="text-sm text-muted-foreground">v{config.version}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{config.location}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
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
          
          <Button 
            variant="outline" 
            onClick={handleReset}
            disabled={!hasChanges || isLoading}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Configuration Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                General Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto Start</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically start agent on system boot
                  </p>
                </div>
                <Switch
                  checked={config.configuration.general.autoStart}
                  onCheckedChange={(value) => updateConfig('general', 'autoStart', value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Log Level</Label>
                <Select
                  value={config.configuration.general.logLevel}
                  onValueChange={(value) => updateConfig('general', 'logLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DEBUG">DEBUG</SelectItem>
                    <SelectItem value="INFO">INFO</SelectItem>
                    <SelectItem value="WARN">WARN</SelectItem>
                    <SelectItem value="ERROR">ERROR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Heartbeat Interval (seconds)</Label>
                <Input
                  type="number"
                  value={config.configuration.general.heartbeatInterval}
                  onChange={(e) => updateConfig('general', 'heartbeatInterval', parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Max Retries</Label>
                <Input
                  type="number"
                  value={config.configuration.general.maxRetries}
                  onChange={(e) => updateConfig('general', 'maxRetries', parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5" />
                Network Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Port</Label>
                <Input
                  type="number"
                  value={config.configuration.network.port}
                  onChange={(e) => updateConfig('network', 'port', parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Protocol</Label>
                <Select
                  value={config.configuration.network.protocol}
                  onValueChange={(value) => updateConfig('network', 'protocol', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HTTP">HTTP</SelectItem>
                    <SelectItem value="HTTPS">HTTPS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Timeout (ms)</Label>
                <Input
                  type="number"
                  value={config.configuration.network.timeout}
                  onChange={(e) => updateConfig('network', 'timeout', parseInt(e.target.value))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable Compression</Label>
                  <p className="text-sm text-muted-foreground">
                    Compress network traffic to reduce bandwidth
                  </p>
                </div>
                <Switch
                  checked={config.configuration.network.compression}
                  onCheckedChange={(value) => updateConfig('network', 'compression', value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable Encryption</Label>
                  <p className="text-sm text-muted-foreground">
                    Encrypt all communication
                  </p>
                </div>
                <Switch
                  checked={config.configuration.security.encryption}
                  onCheckedChange={(value) => updateConfig('security', 'encryption', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Require Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require authentication for all requests
                  </p>
                </div>
                <Switch
                  checked={config.configuration.security.authRequired}
                  onCheckedChange={(value) => updateConfig('security', 'authRequired', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable SSL</Label>
                  <p className="text-sm text-muted-foreground">
                    Use SSL/TLS for secure connections
                  </p>
                </div>
                <Switch
                  checked={config.configuration.security.sslEnabled}
                  onCheckedChange={(value) => updateConfig('security', 'sslEnabled', value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Certificate Path</Label>
                <Input
                  value={config.configuration.security.certificatePath}
                  onChange={(e) => updateConfig('security', 'certificatePath', e.target.value)}
                  placeholder="/path/to/certificate.crt"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Monitoring Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable Metrics</Label>
                  <p className="text-sm text-muted-foreground">
                    Collect performance metrics
                  </p>
                </div>
                <Switch
                  checked={config.configuration.monitoring.metricsEnabled}
                  onCheckedChange={(value) => updateConfig('monitoring', 'metricsEnabled', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable Logging</Label>
                  <p className="text-sm text-muted-foreground">
                    Log system events and errors
                  </p>
                </div>
                <Switch
                  checked={config.configuration.monitoring.loggingEnabled}
                  onCheckedChange={(value) => updateConfig('monitoring', 'loggingEnabled', value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Alert Threshold (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={config.configuration.monitoring.alertThreshold}
                  onChange={(e) => updateConfig('monitoring', 'alertThreshold', parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Reporting Interval (seconds)</Label>
                <Input
                  type="number"
                  value={config.configuration.monitoring.reportingInterval}
                  onChange={(e) => updateConfig('monitoring', 'reportingInterval', parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}