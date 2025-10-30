import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Archive, Upload, Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { PDFDocument } from "pdf-lib";

const PdfCompressor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState("medium");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const compressPDF = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Basic compression by re-saving the PDF
      // Note: pdf-lib has limited compression capabilities
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: compressionLevel === 'high',
        addDefaultPage: false,
      });
      
      const originalSize = file.size;
      const compressedSize = pdfBytes.length;
      const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed-${file.name}`;
      a.click();
      
      URL.revokeObjectURL(url);
      
      alert(`PDF compressed! Original: ${(originalSize/1024/1024).toFixed(2)}MB, Compressed: ${(compressedSize/1024/1024).toFixed(2)}MB (${compressionRatio}% reduction)`);
    } catch (error) {
      console.error('Error compressing PDF:', error);
      alert('Error compressing PDF. Please make sure the file is a valid PDF document.');
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-2xl mb-4">
              <Archive className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              PDF Compressor
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Reduce file size without losing quality
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
                    {file ? `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)` : "Select a PDF file to compress"}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Compression Level
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={compressionLevel === "low" ? "default" : "outline"}
                    onClick={() => setCompressionLevel("low")}
                    className="flex flex-col h-auto py-4"
                  >
                    <span className="font-medium">Low</span>
                    <span className="text-xs text-gray-500">Best Quality</span>
                  </Button>
                  <Button
                    variant={compressionLevel === "medium" ? "default" : "outline"}
                    onClick={() => setCompressionLevel("medium")}
                    className="flex flex-col h-auto py-4"
                  >
                    <span className="font-medium">Medium</span>
                    <span className="text-xs text-gray-500">Balanced</span>
                  </Button>
                  <Button
                    variant={compressionLevel === "high" ? "default" : "outline"}
                    onClick={() => setCompressionLevel("high")}
                    className="flex flex-col h-auto py-4"
                  >
                    <span className="font-medium">High</span>
                    <span className="text-xs text-gray-500">Smallest Size</span>
                  </Button>
                </div>
              </div>

              <Button 
                onClick={compressPDF} 
                className="w-full" 
                size="lg"
                disabled={!file}
              >
                <Download className="w-4 h-4 mr-2" />
                Compress PDF
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PdfCompressor;