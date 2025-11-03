import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Type, Upload, Download, Copy, ArrowLeft, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
import { imageToText } from "@shanto-kumar/image-to-text-convert";

// Set the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const PdfTextExtractor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [useOCR, setUseOCR] = useState(false);
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
      if (useOCR) {
        await extractTextWithOCR();
      } else {
        await extractTextNormal();
      }
    } catch (error) {
      console.error('PDF extraction error:', error);
      setExtractedText(`Error: ${(error as Error).message || "Could not process this PDF file."}`);
      toast({
        title: "Error",
        description: "Failed to process PDF",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const extractTextNormal = async () => {
    const arrayBuffer = await file!.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = "";
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pageText = textContent.items
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((item: any) => !!(item as any).str)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((item: any) => (item as any).str)
        .join(" ");
      fullText += pageText + "\n\n";
    }
    
    if (fullText.trim()) {
      setExtractedText(fullText.trim());
      toast({
        title: "Success",
        description: `Text extracted from ${pdf.numPages} page(s)!`,
      });
    } else {
      const infoText = `No extractable text found in this PDF.\n\nTry enabling OCR mode for scanned documents or Bangla text.`;
      setExtractedText(infoText);
      toast({
        title: "No Text Found",
        description: "Try OCR mode for better results",
      });
    }
  };

  const extractTextWithOCR = async () => {
    const arrayBuffer = await file!.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = "";
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({ canvasContext: context, viewport }).promise;
      
      const imageDataUrl = canvas.toDataURL('image/png');
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      const imageFile = new File([blob], `page-${i}.png`, { type: 'image/png' });
      
      try {
        const pageText = await imageToText(imageFile);
        fullText += pageText + "\n\n";
      } catch (ocrError) {
        console.warn(`OCR failed for page ${i}:`, ocrError);
        fullText += `[OCR failed for page ${i}]\n\n`;
      }
    }
    
    if (fullText.trim()) {
      setExtractedText(fullText.trim());
      toast({
        title: "Success",
        description: `Text extracted using OCR from ${pdf.numPages} page(s)!`,
      });
    } else {
      setExtractedText("No text could be extracted using OCR.");
      toast({
        title: "No Text Found",
        description: "OCR could not extract text from this PDF",
      });
    }
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
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 zmb-6">
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

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="ocr-mode"
                    checked={useOCR}
                    onChange={(e) => setUseOCR(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="ocr-mode" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    Use OCR (Better for Bangla text & scanned PDFs)
                  </label>
                </div>
                
                <Button 
                  onClick={extractText} 
                  className="w-full" 
                  size="lg"
                  disabled={!file || isExtracting}
                >
                  {isExtracting ? (useOCR ? "Processing with OCR..." : "Extracting...") : "Extract Text"}
                </Button>
              </div>

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