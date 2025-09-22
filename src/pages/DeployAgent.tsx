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
  Server, 
  MapPin, 
  Settings, 
  Upload,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DeployAgent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeploying, setIsDeploying] = useState(false);

  const datacenters = [
    { id: "stockholm", name: "Stockholm DC", region: "Europe North" },
    { id: "helsinki", name: "Helsinki DC", region: "Europe North" },
    { id: "oslo", name: "Oslo DC", region: "Europe North" },
    { id: "london", name: "London DC", region: "Europe West" },
  ];

  const agentTypes = [
    { id: "ran-optimizer", name: "RAN Optimizer", description: "Optimizes radio network performance" },
    { id: "coverage-analyzer", name: "Coverage Analyzer", description: "Analyzes network coverage patterns" },
    { id: "interference-detector", name: "Interference Detector", description: "Detects and mitigates interference" },
    { id: "capacity-planner", name: "Capacity Planner", description: "Plans network capacity requirements" },
  ];

  const handleDeploy = async () => {
    setIsDeploying(true);
    // Simulate deployment process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsDeploying(false);
    
    toast({
      title: "Agent Deployed Successfully",
      description: "Your new SW agent is now active and ready to use.",
    });

    // Navigate back to dashboard or agents page
    navigate("/agents");
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
          <h1 className="text-3xl font-bold tracking-tight">Deploy Agent</h1>
          <p className="text-muted-foreground">Configure and deploy a new SW agent to your network</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Agent Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agentName">Agent Name</Label>
                  <Input 
                    id="agentName" 
                    placeholder="e.g., RAN-Agent-004"
                    defaultValue="RAN-Agent-004"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agentType">Agent Type</Label>
                  <Select defaultValue="ran-optimizer">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {agentTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the agent's purpose and configuration..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="datacenter">Target Datacenter</Label>
                <Select defaultValue="stockholm">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {datacenters.map((dc) => (
                      <SelectItem key={dc.id} value={dc.id}>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {dc.name} - {dc.region}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Agent Configuration Files
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drop configuration files here or click to browse
                </p>
                <Button variant="outline" size="sm">
                  Select Files
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm">agent-config.json</span>
                  </div>
                  <Badge variant="outline">Ready</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Agent Type:</span>
                  <span>RAN Optimizer</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Datacenter:</span>
                  <span>Stockholm DC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Region:</span>
                  <span>Europe North</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Time:</span>
                  <span>2-3 minutes</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button 
                  className="w-full" 
                  onClick={handleDeploy}
                  disabled={isDeploying}
                >
                  {isDeploying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Server className="w-4 h-4 mr-2" />
                      Deploy Agent
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agent Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {agentTypes.map((type) => (
                <div key={type.id} className="p-3 rounded-lg bg-secondary/50">
                  <p className="font-medium text-sm">{type.name}</p>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}