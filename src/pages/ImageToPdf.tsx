import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageIcon, Upload, Download, X, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";

const ImageToPdf = () => {
  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const convertToPDF = async () => {
    if (images.length === 0) {
      alert("Please select at least one image");
      return;
    }

    const doc = new jsPDF();
    
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      await new Promise((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          
          const imgData = canvas.toDataURL('image/jpeg', 0.8);
          const imgWidth = 190;
          const imgHeight = (img.height * imgWidth) / img.width;
          
          if (i > 0) doc.addPage();
          doc.addImage(imgData, 'JPEG', 10, 10, imgWidth, imgHeight);
          resolve(null);
        };
        img.src = URL.createObjectURL(image);
      });
    }
    
    doc.save('images-to-pdf.pdf');
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-100 dark:bg-cyan-900/20 rounded-2xl mb-4">
              <ImageIcon className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Image to PDF Converter
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Upload images and generate a PDF
            </p>
          </div>

          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Images
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Drag and drop images here, or click to select
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button asChild>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      Select Images
                    </label>
                  </Button>
                </div>
              </div>

              {images.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Selected Images ({images.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={image.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 truncate">
                          {image.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                onClick={convertToPDF} 
                className="w-full" 
                size="lg"
                disabled={images.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Convert to PDF
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImageToPdf;