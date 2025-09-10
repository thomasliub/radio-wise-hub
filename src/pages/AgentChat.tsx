import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LangflowClient } from "@datastax/langflow-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, Bot, User, Activity } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

interface Agent {
  id: string;
  name: string;
  status: "active" | "inactive" | "maintenance";
  location: string;
}

export default function AgentChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'agent',
      content: 'Hello! I\'m your Radio SW Agent assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [langflowClient, setLangflowClient] = useState<LangflowClient | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize Langflow client
    const client = new LangflowClient({
      baseUrl: "http://localhost:7860", // Replace with your Langflow server URL
      apiKey: "your-api-key" // Replace with your API key if required
    });
    setLangflowClient(client);

    // Simulate fetching agent info
    setAgent({
      id: id || '1',
      name: `RAN-Agent-${id?.padStart(3, '0')}`,
      status: 'active',
      location: 'Stockholm DC - Rack A12'
    });
  }, [id]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      if (!langflowClient) {
        throw new Error("Langflow client not initialized");
      }

      // Use Langflow client to run the flow
      const flowId = 'your-flow-id'; // Replace with actual flow ID
      const flow = langflowClient.flow(flowId);
      
      // Run the flow with the user's message
      const response = await flow.run(inputMessage, {
        // Optional: Session ID to maintain conversation context
        session_id: `agent-${id}-session`,
        // Optional: Tweaks/configuration for the flow
        tweaks: {
          agent_context: agent?.name,
          agent_location: agent?.location,
          agent_id: id
        }
      });

      // Extract the response text from Langflow response
      const agentResponse = response.chatOutputText() || 
                          "I'm sorry, I couldn't process your request right now.";

      const agentMessage: Message = {
        id: Date.now().toString(),
        type: 'agent',
        content: agentResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'agent',
        content: "I'm experiencing some technical difficulties. Please try again later.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!agent) {
    return <div className="flex items-center justify-center h-96">Loading agent...</div>;
  }

  return (
    <div className="space-y-6 h-[calc(100vh-12rem)]">
      {/* Header */}
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
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{agent.name} Chat</h1>
            <div className="flex items-center gap-2">
              <Badge className="bg-success text-success-foreground">
                <Activity className="w-3 h-3 mr-1" />
                {agent.status}
              </Badge>
              <span className="text-sm text-muted-foreground">{agent.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Agent Assistant</CardTitle>
          <p className="text-sm text-muted-foreground">
            Chat with your Radio SW Agent for support and information
          </p>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col min-h-0">
          {/* Messages */}
          <ScrollArea className="flex-1 pr-4 mb-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.type === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-primary/10' 
                      : 'bg-muted'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-primary" />
                    ) : (
                      <Bot className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className={`flex-1 max-w-[70%] ${
                    message.type === 'user' ? 'text-right' : ''
                  }`}>
                    <div className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Bot className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 max-w-[70%]">
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}