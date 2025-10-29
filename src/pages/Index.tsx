import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { 
  Image, QrCode, Scan, FileText, FileCode, Palette, 
  Scale, TestTube, Braces, FileType, Wrench
} from "lucide-react";

const tools = [
  {
    name: "Image Resizer",
    description: "Resize or crop images with live preview",
    icon: Image,
    path: "/image-resizer",
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "QR Code Generator",
    description: "Create QR codes for links or text",
    icon: QrCode,
    path: "/qr-generator",
    color: "from-purple-500 to-pink-500"
  },
  {
    name: "Barcode Scanner",
    description: "Scan and decode barcodes via webcam",
    icon: Scan,
    path: "/barcode-scanner",
    color: "from-green-500 to-emerald-500"
  },
  {
    name: "Text Summarizer",
    description: "Summarize long articles or documents",
    icon: FileText,
    path: "/text-summarizer",
    color: "from-orange-500 to-red-500"
  },
  {
    name: "Markdown Editor",
    description: "Live preview and export to HTML/PDF",
    icon: FileCode,
    path: "/markdown-editor",
    color: "from-indigo-500 to-purple-500"
  },
  {
    name: "Color Palette Extractor",
    description: "Get dominant colors from images",
    icon: Palette,
    path: "/color-extractor",
    color: "from-pink-500 to-rose-500"
  },
  {
    name: "Unit Converter",
    description: "Convert between metric/imperial, currency",
    icon: Scale,
    path: "/unit-converter",
    color: "from-teal-500 to-cyan-500"
  },
  {
    name: "Regex Tester",
    description: "Test and debug regular expressions",
    icon: TestTube,
    path: "/regex-tester",
    color: "from-yellow-500 to-orange-500"
  },
  {
    name: "JSON Formatter",
    description: "Beautify and validate JSON input",
    icon: Braces,
    path: "/json-formatter",
    color: "from-blue-500 to-indigo-500"
  },
  {
    name: "File Metadata Viewer",
    description: "Inspect file properties and details",
    icon: FileType,
    path: "/file-metadata",
    color: "from-gray-500 to-slate-500"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-center mb-4">
            <Wrench className="w-12 h-12 text-primary mr-3" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            DevTools Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your all-in-one productivity toolkit. Fast, free, and powerful utilities for everyday tasks.
          </p>
        </header>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {tools.map((tool, index) => (
            <Link 
              key={tool.path} 
              to={tool.path}
              className="group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Card className="p-6 h-full hover:shadow-[var(--shadow-elevated)] transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/50 bg-card">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {tool.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-muted-foreground">
          <p className="text-sm">All tools run locally in your browser. Your data never leaves your device.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
