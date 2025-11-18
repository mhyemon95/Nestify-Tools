import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Upload, Copy, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import Tesseract from "tesseract.js";

const ImageToText = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [extractedText, setExtractedText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setExtractedText("");
      setProgress(0);
      
      const url = URL.createObjectURL(selectedFile);
      setImageUrl(url);
    }
  };

  const extractText = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });
      
      setExtractedText(result.data.text);
    } catch (error) {
      console.error('Error extracting text:', error);
      alert('Error extracting text from image. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
      alert('Text copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      alert('Error copying text to clipboard.');
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
              <Eye className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Image to Text (OCR)
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Extract text from images using optical character recognition
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {file ? file.name : "Select an image file (PNG, JPG, JPEG)"}
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button asChild>
                      <label htmlFor="image-upload" className="cursor-pointer">
                        Select Image
                      </label>
                    </Button>
                  </div>
                </div>

                {imageUrl && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Image Preview
                    </h3>
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="w-full max-h-64 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  </div>
                )}

                <Button 
                  onClick={extractText} 
                  className="w-full" 
                  size="lg"
                  disabled={!file || isProcessing}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {isProcessing ? `Extracting... ${progress}%` : "Extract Text"}
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Extracted Text
                  </h3>
                  {extractedText && (
                    <Button 
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  )}
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-h-[300px]">
                  {isProcessing ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-300">
                          Processing image... {progress}%
                        </p>
                      </div>
                    </div>
                  ) : extractedText ? (
                    <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {extractedText}
                    </pre>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center">
                      Upload an image and click "Extract Text" to see the results
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageToText;