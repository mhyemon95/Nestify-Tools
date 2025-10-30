import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Image, QrCode, Scan, FileText, FileCode, Palette, 
  Scale, TestTube, Braces, FileType, Zap, Shield, Clock,
  FilePlus, GitMerge, Scissors, Archive, FileImage, ImageIcon,
  Edit3, FormInput, Lock, Type, Wand2, Package
} from "lucide-react";

const tools = [
  // Document & PDF Tools
  {
    name: "PDF Generator",
    description: "Convert HTML or Markdown to downloadable PDFs",
    icon: FilePlus,
    path: "/pdf-generator",
    color: "from-red-500 to-pink-500",
    category: "Document & PDF Tools"
  },
  {
    name: "PDF Merger",
    description: "Combine multiple PDFs into one",
    icon: GitMerge,
    path: "/pdf-merger",
    color: "from-blue-500 to-indigo-500",
    category: "Document & PDF Tools"
  },
  {
    name: "PDF Splitter",
    description: "Split PDFs by page range or bookmarks",
    icon: Scissors,
    path: "/pdf-splitter",
    color: "from-green-500 to-emerald-500",
    category: "Document & PDF Tools"
  },
  {
    name: "PDF Compressor",
    description: "Reduce file size without losing quality",
    icon: Archive,
    path: "/pdf-compressor",
    color: "from-orange-500 to-red-500",
    category: "Document & PDF Tools"
  },

  {
    name: "Image to PDF Converter",
    description: "Upload images and generate a PDF",
    icon: ImageIcon,
    path: "/image-to-pdf",
    color: "from-cyan-500 to-blue-500",
    category: "Document & PDF Tools"
  },
  {
    name: "PDF Annotator",
    description: "Add comments, highlights, or stamps",
    icon: Edit3,
    path: "/pdf-annotator",
    color: "from-yellow-500 to-orange-500",
    category: "Document & PDF Tools"
  },
  {
    name: "PDF Form Filler",
    description: "Fill and save interactive PDF forms",
    icon: FormInput,
    path: "/pdf-form-filler",
    color: "from-teal-500 to-cyan-500",
    category: "Document & PDF Tools"
  },

  {
    name: "PDF Text Extractor",
    description: "Extract text from uploaded PDFs",
    icon: Type,
    path: "/pdf-text-extractor",
    color: "from-indigo-500 to-purple-500",
    category: "Document & PDF Tools"
  },
  // Utility & Productivity Tools
  {
    name: "Image Resizer",
    description: "Resize or crop images with live preview",
    icon: Image,
    path: "/image-resizer",
    color: "from-blue-500 to-cyan-500",
    category: "Utility & Productivity Tools"
  },
  {
    name: "Image Size Compressor",
    description: "Reduce image file sizes while maintaining quality",
    icon: Package,
    path: "/image-size-compressor",
    color: "from-green-500 to-emerald-500",
    category: "Utility & Productivity Tools"
  },
  {
    name: "Background Image Remove",
    description: "Automatically remove backgrounds from your images with AI",
    icon: Wand2,
    path: "/background-image-remove",
    color: "from-purple-500 to-pink-500",
    category: "Utility & Productivity Tools"
  },
  {
    name: "QR Code Generator",
    description: "Create QR codes for links or text",
    icon: QrCode,
    path: "/qr-generator",
    color: "from-purple-500 to-pink-500",
    category: "Utility & Productivity Tools"
  },
  {
    name: "Barcode Scanner",
    description: "Scan and decode barcodes via webcam",
    icon: Scan,
    path: "/barcode-scanner",
    color: "from-green-500 to-emerald-500",
    category: "Utility & Productivity Tools"
  },
  {
    name: "Text Summarizer",
    description: "Summarize long articles or documents",
    icon: FileText,
    path: "/text-summarizer",
    color: "from-orange-500 to-red-500",
    category: "Utility & Productivity Tools"
  },
  {
    name: "Markdown Editor",
    description: "Live preview and export to HTML/PDF",
    icon: FileCode,
    path: "/markdown-editor",
    color: "from-indigo-500 to-purple-500",
    category: "Utility & Productivity Tools"
  },
  {
    name: "Color Palette Extractor",
    description: "Get dominant colors from images",
    icon: Palette,
    path: "/color-extractor",
    color: "from-pink-500 to-rose-500",
    category: "Utility & Productivity Tools"
  },
  {
    name: "Unit Converter",
    description: "Convert between metric/imperial, currency",
    icon: Scale,
    path: "/unit-converter",
    color: "from-teal-500 to-cyan-500",
    category: "Utility & Productivity Tools"
  },
  {
    name: "Regex Tester",
    description: "Test and debug regular expressions",
    icon: TestTube,
    path: "/regex-tester",
    color: "from-yellow-500 to-orange-500",
    category: "Utility & Productivity Tools"
  },
  {
    name: "JSON Formatter",
    description: "Beautify and validate JSON input",
    icon: Braces,
    path: "/json-formatter",
    color: "from-blue-500 to-indigo-500",
    category: "Utility & Productivity Tools"
  },
  {
    name: "File Metadata Viewer",
    description: "Inspect file properties and details",
    icon: FileType,
    path: "/file-metadata",
    color: "from-gray-500 to-slate-500",
    category: "Utility & Productivity Tools"
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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Nestify Tools</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#pdf-tools" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">PDF Tools</a>
              <a href="#utility-tools" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Utilities</a>
              <a href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Features</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
           
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-3">
              Professional Online
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Toolkit</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Streamline your workflow with our comprehensive suite of professional-grade tools. 
              From PDF processing to productivity utilities, everything you need in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-1">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg" onClick={() => document.getElementById('pdf-tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                Document & PDF Tools
              </Button>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg" onClick={() => document.getElementById('utility-tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                Utility & Productivity Tools
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-2 bg-gray-50 dark:bg-gray-800 -mt-11">
        <div className="container mx-auto px-4">
          {/* Document & PDF Tools */}
          <div id="pdf-tools" className="mb-20 pt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Document & PDF Tools
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Professional PDF processing tools for all your document needs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tools.filter(tool => tool.category === "Document & PDF Tools").map((tool, index) => (
                <Link 
                  key={tool.path} 
                  to={tool.path}
                  className="group"
                >
                  <Card className="h-full p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center mr-4`}>
                        <tool.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {tool.name}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {tool.description}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Utility & Productivity Tools */}
          <div id="utility-tools" className="pt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Utility & Productivity Tools
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Essential utilities to boost your productivity and streamline workflows
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tools.filter(tool => tool.category === "Utility & Productivity Tools").map((tool, index) => (
                <Link 
                  key={tool.path} 
                  to={tool.path}
                  className="group"
                >
                  <Card className="h-full p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tool.color} flex items-center justify-center mr-4`}>
                        <tool.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {tool.name}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {tool.description}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Nestify Tools?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built with privacy, performance, and user experience in mind
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl mb-6">
                  <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Nestify Tools</span>
            </div>
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-gray-300">
                100% Private - All processing happens locally in your browser
              </span>
            </div>
            <div className="border-t border-gray-800 pt-6">
              <p className="text-gray-400">
                © 2025 Meherub Hossain Yemon. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;