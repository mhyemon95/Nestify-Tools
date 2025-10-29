import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { Download } from "lucide-react";
import { toast } from "sonner";

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState("# Welcome to Markdown Editor\n\n**Bold text** and *italic text*\n\n- List item 1\n- List item 2\n\n```javascript\nconst hello = 'world';\n```");

  const downloadHTML = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Markdown Export</title>
  <style>
    body { font-family: system-ui; max-width: 800px; margin: 40px auto; padding: 0 20px; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
    pre { background: #f4f4f4; padding: 16px; border-radius: 6px; overflow-x: auto; }
  </style>
</head>
<body>${document.getElementById('preview')?.innerHTML}</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markdown-export.html";
    a.click();
    toast.success("HTML downloaded!");
  };

  return (
    <ToolLayout
      title="Markdown Editor"
      description="Live preview and export to HTML"
    >
      <div className="space-y-4">
        <Button onClick={downloadHTML} className="bg-gradient-to-r from-primary to-accent">
          <Download className="w-4 h-4 mr-2" />
          Export as HTML
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Markdown Input</h3>
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="font-mono text-sm h-96"
              placeholder="Write markdown here..."
            />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Live Preview</h3>
            <div
              id="preview"
              className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-lg h-96 overflow-y-auto bg-muted"
            >
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default MarkdownEditor;
