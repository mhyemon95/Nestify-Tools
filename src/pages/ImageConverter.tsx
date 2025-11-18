import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Upload, Download, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

type ImageFormat = 'png' | 'jpg' | 'webp';

const ImageConverter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('png');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setImageUrl(url);
    }
  };

  const convertImage = async () => {
    if (!file || !imageUrl) return;

    setIsProcessing(true);
    try {
      const img = new Image();
      img.src = imageUrl;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');
      
      ctx.drawImage(img, 0, 0);

      const mimeType = targetFormat === 'jpg' ? 'image/jpeg' : `image/${targetFormat}`;
      const quality = targetFormat === 'jpg' ? 0.95 : undefined;
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name.replace(/\.[^.]+$/, `.${targetFormat}`);
        a.click();
        URL.revokeObjectURL(url);
        setIsProcessing(false);
      }, mimeType, quality);
    } catch (error) {
      console.error('Error converting image:', error);
      alert('Error converting image. Please try again.');
      setIsProcessing(false);
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
              <RefreshCw className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Image Converter
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Convert between PNG, JPG, and WebP formats
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
                      {file ? file.name : "Select an image (PNG, JPG, WebP)"}
                    </p>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
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
                      Preview
                    </h3>
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="w-full max-h-64 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Convert To
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant={targetFormat === 'png' ? 'default' : 'outline'}
                      onClick={() => setTargetFormat('png')}
                      className="w-full"
                    >
                      PNG
                    </Button>
                    <Button
                      variant={targetFormat === 'jpg' ? 'default' : 'outline'}
                      onClick={() => setTargetFormat('jpg')}
                      className="w-full"
                    >
                      JPG
                    </Button>
                    <Button
                      variant={targetFormat === 'webp' ? 'default' : 'outline'}
                      onClick={() => setTargetFormat('webp')}
                      className="w-full"
                    >
                      WebP
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Format Info
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    {targetFormat === 'png' && (
                      <>
                        <li>• Lossless compression</li>
                        <li>• Supports transparency</li>
                        <li>• Best for graphics & logos</li>
                      </>
                    )}
                    {targetFormat === 'jpg' && (
                      <>
                        <li>• Lossy compression</li>
                        <li>• Smaller file size</li>
                        <li>• Best for photos</li>
                      </>
                    )}
                    {targetFormat === 'webp' && (
                      <>
                        <li>• Modern format</li>
                        <li>• Better compression</li>
                        <li>• Supports transparency</li>
                      </>
                    )}
                  </ul>
                </div>

                <Button 
                  onClick={convertImage} 
                  className="w-full" 
                  size="lg"
                  disabled={!file || isProcessing}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isProcessing ? "Converting..." : `Convert to ${targetFormat.toUpperCase()}`}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageConverter;