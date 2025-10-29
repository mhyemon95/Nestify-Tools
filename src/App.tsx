import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ImageResizer from "./pages/ImageResizer";
import QRGenerator from "./pages/QRGenerator";
import BarcodeScanner from "./pages/BarcodeScanner";
import TextSummarizer from "./pages/TextSummarizer";
import MarkdownEditor from "./pages/MarkdownEditor";
import ColorExtractor from "./pages/ColorExtractor";
import UnitConverter from "./pages/UnitConverter";
import RegexTester from "./pages/RegexTester";
import JSONFormatter from "./pages/JSONFormatter";
import FileMetadata from "./pages/FileMetadata";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/image-resizer" element={<ImageResizer />} />
          <Route path="/qr-generator" element={<QRGenerator />} />
          <Route path="/barcode-scanner" element={<BarcodeScanner />} />
          <Route path="/text-summarizer" element={<TextSummarizer />} />
          <Route path="/markdown-editor" element={<MarkdownEditor />} />
          <Route path="/color-extractor" element={<ColorExtractor />} />
          <Route path="/unit-converter" element={<UnitConverter />} />
          <Route path="/regex-tester" element={<RegexTester />} />
          <Route path="/json-formatter" element={<JSONFormatter />} />
          <Route path="/file-metadata" element={<FileMetadata />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
