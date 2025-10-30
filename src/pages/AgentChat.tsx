import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
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
      // Direct Langflow API call (browser-compatible)
      const langflowUrl = 'http://localhost:7860/api/v1/run/your-flow-id'; // Replace with your Langflow server URL and flow ID
      
      const response = await fetch(langflowUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer your-api-key` // Replace with your API key if required
        },
        body: JSON.stringify({
          input_value: inputMessage,
          input_type: "chat",
          output_type: "chat",
          session_id: `agent-${id}-session`, // Maintain conversation context
          tweaks: {
            // Flow-specific parameters
            agent_context: agent?.name,
            agent_location: agent?.location,
            agent_id: id
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract response from Langflow API response structure
      const agentResponse = data.outputs?.[0]?.outputs?.[0]?.results?.message?.text || 
                          data.result?.message?.text ||
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
                      {message.type === 'user' ? (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      ) : (
                        <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed text-foreground">{children}</p>,
                              ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1.5 marker:text-primary">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1.5 marker:text-primary">{children}</ol>,
                              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                              code: ({ node, inline, ...props }: any) => 
                                inline ? (
                                  <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono text-xs font-semibold border border-primary/20" {...props} />
                                ) : (
                                  <code className="font-mono text-xs" {...props} />
                                ),
                              pre: ({ children }) => (
                                <pre className="bg-card border border-border p-4 rounded-lg overflow-x-auto mb-3 shadow-sm">
                                  {children}
                                </pre>
                              ),
                              h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0 text-foreground border-b border-border pb-2">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-lg font-bold mb-2.5 mt-3 first:mt-0 text-foreground">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-base font-semibold mb-2 mt-2.5 first:mt-0 text-foreground">{children}</h3>,
                              h4: ({ children }) => <h4 className="text-sm font-semibold mb-1.5 mt-2 first:mt-0 text-foreground">{children}</h4>,
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-primary bg-primary/5 pl-4 pr-3 py-2 mb-3 italic rounded-r">
                                  {children}
                                </blockquote>
                              ),
                              a: ({ children, href }) => (
                                <a 
                                  href={href} 
                                  className="text-primary font-medium underline decoration-primary/30 hover:decoration-primary transition-colors" 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  {children}
                                </a>
                              ),
                              table: ({ children }) => (
                                <div className="overflow-x-auto mb-3">
                                  <table className="min-w-full border border-border rounded-lg overflow-hidden">
                                    {children}
                                  </table>
                                </div>
                              ),
                              thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
                              tbody: ({ children }) => <tbody className="divide-y divide-border">{children}</tbody>,
                              tr: ({ children }) => <tr className="hover:bg-muted/50 transition-colors">{children}</tr>,
                              th: ({ children }) => <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">{children}</th>,
                              td: ({ children }) => <td className="px-4 py-2 text-sm">{children}</td>,
                              hr: () => <hr className="my-4 border-border" />,
                              img: ({ src, alt }) => (
                                <img 
                                  src={src} 
                                  alt={alt || ''} 
                                  className="rounded-lg shadow-sm my-3 max-w-full h-auto border border-border"
                                />
                              ),
                              strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                              em: ({ children }) => <em className="italic text-foreground">{children}</em>,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
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