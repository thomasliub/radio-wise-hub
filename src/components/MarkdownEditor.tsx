import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image, Eye, Edit } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
}

export function MarkdownEditor({ value, onChange, label, placeholder, rows = 8 }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState("edit");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePath, setImagePath] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const { toast } = useToast();

  const handleInsertImage = () => {
    if (!imagePath.trim()) {
      toast({
        title: "Image path required",
        description: "Please enter an image path or URL",
        variant: "destructive",
      });
      return;
    }

    const markdownImage = `![${imageAlt || "image"}](${imagePath})`;
    onChange(value + (value ? '\n\n' : '') + markdownImage);
    
    toast({
      title: "Image inserted",
      description: "Image reference has been added to markdown",
    });

    setImagePath("");
    setImageAlt("");
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-2">
          <TabsList>
            <TabsTrigger value="edit" className="gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Image className="w-4 h-4" />
                Insert Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insert Image</DialogTitle>
                <DialogDescription>
                  Enter the image path or URL. For local images, use paths like "/images/photo.jpg" or relative paths.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-path">Image Path/URL</Label>
                  <Input
                    id="image-path"
                    placeholder="/images/photo.jpg or https://example.com/image.png"
                    value={imagePath}
                    onChange={(e) => setImagePath(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleInsertImage()}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image-alt">Alt Text (optional)</Label>
                  <Input
                    id="image-alt"
                    placeholder="Description of the image"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleInsertImage()}
                  />
                </div>
                <Button onClick={handleInsertImage} className="w-full">
                  Insert
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <TabsContent value="edit" className="mt-0">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Supports markdown syntax. Use the "Insert Image" button to reference images by path or URL.
          </p>
        </TabsContent>
        
        <TabsContent value="preview" className="mt-0">
          <div className="min-h-[200px] p-4 border rounded-md bg-background">
            {value ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {value}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No content to preview</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
