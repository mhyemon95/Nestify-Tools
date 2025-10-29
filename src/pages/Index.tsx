import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Image, QrCode, Scan, FileText, FileCode, Palette, 
  Scale, TestTube, Braces, FileType, Zap, Shield, Clock
} from "lucide-react";

const tools = [
  {
    name: "Image Resizer",
    description: "Resize or crop images with live preview",
    icon: Image,
    path: "/image-resizer",
    color: "from-blue-500 to-cyan-500",
    category: "Media"
  },
  {
    name: "QR Code Generator",
    description: "Create QR codes for links or text",
    icon: QrCode,
    path: "/qr-generator",
    color: "from-purple-500 to-pink-500",
    category: "Generators"
  },
  {
    name: "Barcode Scanner",
    description: "Scan and decode barcodes via webcam",
    icon: Scan,
    path: "/barcode-scanner",
    color: "from-green-500 to-emerald-500",
    category: "Scanners"
  },
  {
    name: "Text Summarizer",
    description: "Summarize long articles or documents",
    icon: FileText,
    path: "/text-summarizer",
    color: "from-orange-500 to-red-500",
    category: "Text"
  },
  {
    name: "Markdown Editor",
    description: "Live preview and export to HTML/PDF",
    icon: FileCode,
    path: "/markdown-editor",
    color: "from-indigo-500 to-purple-500",
    category: "Editors"
  },
  {
    name: "Color Palette Extractor",
    description: "Get dominant colors from images",
    icon: Palette,
    path: "/color-extractor",
    color: "from-pink-500 to-rose-500",
    category: "Design"
  },
  {
    name: "Unit Converter",
    description: "Convert between metric/imperial, currency",
    icon: Scale,
    path: "/unit-converter",
    color: "from-teal-500 to-cyan-500",
    category: "Converters"
  },
  {
    name: "Regex Tester",
    description: "Test and debug regular expressions",
    icon: TestTube,
    path: "/regex-tester",
    color: "from-yellow-500 to-orange-500",
    category: "Development"
  },
  {
    name: "JSON Formatter",
    description: "Beautify and validate JSON input",
    icon: Braces,
    path: "/json-formatter",
    color: "from-blue-500 to-indigo-500",
    category: "Development"
  },
  {
    name: "File Metadata Viewer",
    description: "Inspect file properties and details",
    icon: FileType,
    path: "/file-metadata",
    color: "from-gray-500 to-slate-500",
    category: "Utilities"
  }
];

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "All tools run instantly in your browser"
  },
  {
    icon: Shield,
    title: "100% Private",
    description: "Your data never leaves your device"
  },
  {
    icon: Clock,
    title: "Always Available",
    description: "Works offline, no registration required"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-6">
              <div className="flex items-center space-x-2 px-3 py-1 bg-primary/20 rounded-full">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Free Developer Tools</span>
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent mb-6">
              DevTools Hub
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Your complete productivity toolkit. Fast, secure, and powerful utilities
              <br className="hidden md:block" />
              for developers and creators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3">
                Explore Tools
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Choose Your Tool
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Select from our collection of carefully crafted utilities designed to boost your productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {tools.map((tool, index) => (
              <Link 
                key={tool.path} 
                to={tool.path}
                className="group"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <Card className="relative p-6 h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500" style={{backgroundImage: `linear-gradient(135deg, ${tool.color.split(' ')[1]}, ${tool.color.split(' ')[3]})`}} />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <tool.icon className="w-7 h-7 text-white" />
                      </div>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                        {tool.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Secure & Private - Your data stays on your device
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © 2025 Meherub Hossain Yemon. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
