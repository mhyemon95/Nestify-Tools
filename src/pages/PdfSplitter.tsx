import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Scissors, Upload, Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { PDFDocument } from "pdf-lib";

const PdfSplitter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [splitType, setSplitType] = useState("pages");
  const [pageRange, setPageRange] = useState("");
  const [totalPages, setTotalPages] = useState<number | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        setTotalPages(pdfDoc.getPageCount());
      } catch (error) {
        console.error('Error reading PDF:', error);
        setTotalPages(null);
      }
    }
  };

  const splitPDF = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    if (splitType === "pages" && !pageRange.trim()) {
      alert("Please enter page ranges (e.g., 1-3, 5-7)");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = pdfDoc.getPageCount();
      
      if (splitType === "pages") {
        const ranges = pageRange.split(',').map(range => range.trim());
        
        for (let i = 0; i < ranges.length; i++) {
          const range = ranges[i];
          const [start, end] = range.includes('-') 
            ? range.split('-').map(n => parseInt(n.trim()) - 1)
            : [parseInt(range) - 1, parseInt(range) - 1];
          
          if (start >= 0 && end < totalPages && start <= end) {
            const newPdf = await PDFDocument.create();
            const pages = await newPdf.copyPages(pdfDoc, Array.from({length: end - start + 1}, (_, i) => start + i));
            pages.forEach(page => newPdf.addPage(page));
            
            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `split-pages-${start + 1}-to-${end + 1}.pdf`;
            a.click();
            
            URL.revokeObjectURL(url);
          }
        }
      } else {
        // Split by bookmarks - basic implementation
        alert("Bookmark splitting is not yet implemented. Please use page range splitting.");
      }
    } catch (error) {
      console.error('Error splitting PDF:', error);
      alert('Error splitting PDF. Please check your page ranges and try again.');
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
              <Scissors className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              PDF Splitter
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Split PDFs by page range or bookmarks
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
                    {file ? file.name : "Select a PDF file to split"}
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
                  Split Method
                </label>
                <div className="flex gap-4">
                  <Button
                    variant={splitType === "pages" ? "default" : "outline"}
                    onClick={() => setSplitType("pages")}
                  >
                    By Page Range
                  </Button>
                  <Button
                    variant={splitType === "bookmarks" ? "default" : "outline"}
                    onClick={() => setSplitType("bookmarks")}
                  >
                    By Bookmarks
                  </Button>
                </div>
              </div>

              {splitType === "pages" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Page Range (e.g., 1-5, 10-15){totalPages && ` - Total pages: ${totalPages}`}
                  </label>
                  <Input
                    placeholder="Enter page ranges separated by commas"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                  />
                </div>
              )}

              <Button 
                onClick={splitPDF} 
                className="w-full" 
                size="lg"
                disabled={!file}
              >
                <Download className="w-4 h-4 mr-2" />
                Split PDF
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PdfSplitter;