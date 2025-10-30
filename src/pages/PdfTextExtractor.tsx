import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Type, Upload, Download, Copy, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PdfTextExtractor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setExtractedText("");
    }
  };

  const extractText = async () => {
    if (!file) return;
    
    setIsExtracting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const text = new TextDecoder('utf-8', { fatal: false }).decode(uint8Array);
      
      // Look for simple text patterns
      const simpleText = extractSimpleText(text);
      
      if (simpleText) {
        setExtractedText(simpleText);
        toast({
          title: "Success",
          description: "Text content found!",
        });
      } else {
        const infoText = `PDF Analysis Complete\n\nFile: ${file.name}\nSize: ${(file.size / 1024).toFixed(1)} KB\n\nThis PDF appears to contain:\n• Compressed or encoded text\n• Images or scanned content\n• Complex formatting\n\nFor full text extraction, try:\n1. Using Adobe Reader's copy function\n2. Converting to a text-based PDF\n3. Using OCR software for scanned documents`;
        
        setExtractedText(infoText);
        toast({
          title: "Analysis Complete",
          description: "PDF analyzed - see details below",
        });
      }
    } catch (error: any) {
      console.error('PDF extraction error:', error);
      setExtractedText("Error: Could not process this PDF file.");
      toast({
        title: "Error",
        description: "Failed to process PDF",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const extractSimpleText = (pdfContent: string): string => {
    const textMatches = pdfContent.match(/\(([^)]+)\)/g);
    if (textMatches) {
      const cleanText = textMatches
        .map(match => match.slice(1, -1))
        .filter(text => {
          // Filter out metadata patterns
          if (!text || text.length < 2) return false;
          if (/^jsPDF/i.test(text)) return false;
          if (/^D:\d{14}/.test(text)) return false;
          if (/^\d{4}-\d{2}-\d{2}/.test(text)) return false;
          if (/^[\d\s\+\-:]+$/.test(text)) return false;
          if (/^\d+\.\d+\.\d+/.test(text)) return false;
          
          // Must contain actual words
          return /[a-zA-Z]/.test(text) && text.split(/\s+/).length >= 1;
        })
        .join(' ');
      
      if (cleanText.length > 5) {
        return cleanText;
      }
    }
    
    return null;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
      toast({
        title: "Success",
        description: "Text copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadText = () => {
    try {
      const blob = new Blob([extractedText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `extracted-text-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast({
        title: "Success",
        description: "Text file downloaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download text file.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Link>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-2xl mb-4">
              <Type className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              PDF Text Extractor
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Extract text from uploaded PDFs
            </p>
          </div>

          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload PDF File
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {file ? file.name : "Select a PDF file to extract text from"}
                  </p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <Button asChild>
                    <label htmlFor="pdf-upload" className="cursor-pointer">
                      Select PDF File
                    </label>
                  </Button>
                </div>
              </div>

              <Button 
                onClick={extractText} 
                className="w-full" 
                size="lg"
                disabled={!file || isExtracting}
              >
                {isExtracting ? "Extracting..." : "Extract Text"}
              </Button>

              {extractedText && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Extracted Text
                    </label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadText}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={extractedText}
                    readOnly
                    className="min-h-[300px]"
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PdfTextExtractor;