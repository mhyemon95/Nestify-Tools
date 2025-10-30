import { Card } from "@/components/ui/card";
import { FileImage, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PdfToImage = () => {
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
              Feature temporarily unavailable
            </p>
          </div>

          <Card className="p-6">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300">
                This feature is currently under development.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PdfToImage;