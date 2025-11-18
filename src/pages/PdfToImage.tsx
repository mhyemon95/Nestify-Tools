import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileImage, ArrowLeft, Upload, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { PDFDocument } from "pdf-lib";

const PdfToImage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImages([]);
      
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        setTotalPages(pdf.getPageCount());
      } catch (error) {
        console.error('Error loading PDF:', error);
        alert('Error loading PDF. Please make sure the file is a valid PDF document.');
      }
    }
  };

  const convertToImages = async () => {
    if (!file) return;

    setIsProcessing(true);
    alert('PDF to Image conversion requires additional setup. This feature will be available soon.');
    setIsProcessing(false);
  };

  const downloadImages = async () => {
    if (images.length === 0) return;
    const link = document.createElement('a');
    link.href = images[0];
    link.download = `${file?.name.replace('.pdf', '') || 'page'}-1.png`;
    link.click();
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-2xl mb-4">
              <FileImage className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              PDF to Image Converter
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Convert PDF pages to high-quality images
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
                    {file ? `${file.name} (${totalPages} pages)` : "Select a PDF file to convert to images"}
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

              {images.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Generated Images ({images.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {images.map((imageUrl, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                        <img 
                          src={imageUrl} 
                          alt={`Page ${index + 1}`} 
                          className="w-full h-32 object-contain mb-2"
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                          Page {index + 1}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button 
                  onClick={convertToImages} 
                  className="flex-1" 
                  size="lg"
                  disabled={!file || isProcessing}
                >
                  <FileImage className="w-4 h-4 mr-2" />
                  {isProcessing ? "Converting..." : "Convert to Images"}
                </Button>
                
                {images.length > 0 && (
                  <Button 
                    onClick={downloadImages} 
                    variant="outline"
                    size="lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download {images.length > 1 ? 'ZIP' : 'Image'}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PdfToImage;