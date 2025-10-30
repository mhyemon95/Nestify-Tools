import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FilePlus, Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";

const PdfGenerator = () => {
  const [content, setContent] = useState("");
  const [format, setFormat] = useState("html");

  const generatePDF = () => {
    if (!content.trim()) {
      alert("Please enter some content to generate PDF");
      return;
    }

    const doc = new jsPDF();
    
    if (format === "html") {
      // Simple HTML to text conversion for basic implementation
      const textContent = content.replace(/<[^>]*>/g, '');
      const lines = doc.splitTextToSize(textContent, 180);
      doc.text(lines, 10, 20);
    } else {
      // Markdown to text conversion for basic implementation
      const textContent = content.replace(/[#*_`]/g, '');
      const lines = doc.splitTextToSize(textContent, 180);
      doc.text(lines, 10, 20);
    }
    
    doc.save('generated-document.pdf');
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl mb-4">
              <FilePlus className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              PDF Generator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Convert HTML or Markdown to downloadable PDFs
            </p>
          </div>

          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Input Format
                </label>
                <div className="flex gap-4">
                  <Button
                    variant={format === "html" ? "default" : "outline"}
                    onClick={() => setFormat("html")}
                  >
                    HTML
                  </Button>
                  <Button
                    variant={format === "markdown" ? "default" : "outline"}
                    onClick={() => setFormat("markdown")}
                  >
                    Markdown
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </label>
                <Textarea
                  placeholder={`Enter your ${format.toUpperCase()} content here...`}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[300px]"
                />
              </div>

              <Button onClick={generatePDF} className="w-full" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Generate PDF
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PdfGenerator;