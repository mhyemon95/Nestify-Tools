import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Upload, Download, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import mammoth from "mammoth";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const WordToPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const convertToPdf = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value;

      const container = document.createElement('div');
      container.style.width = '210mm';
      container.style.padding = '20mm';
      container.style.backgroundColor = 'white';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.innerHTML = html;
      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      document.body.removeChild(container);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(file.name.replace(/\.(docx?|doc)$/i, '') + '.pdf');
    } catch (error) {
      console.error('Error converting Word to PDF:', error);
      alert('Error converting Word document. Please try again.');
    } finally {
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-2xl mb-4">
              <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Word to PDF Converter
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Convert Word documents to PDF with formatting preserved
            </p>
          </div>

          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Word File
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {file ? file.name : "Select a Word file (.docx) to convert to PDF"}
                  </p>
                  <input
                    type="file"
                    accept=".docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="word-upload"
                  />
                  <Button asChild>
                    <label htmlFor="word-upload" className="cursor-pointer">
                      Select Word File
                    </label>
                  </Button>
                </div>
              </div>

              <Button 
                onClick={convertToPdf} 
                className="w-full" 
                size="lg"
                disabled={!file || isProcessing}
              >
                <Download className="w-4 h-4 mr-2" />
                {isProcessing ? "Converting..." : "Convert to PDF"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WordToPdf;