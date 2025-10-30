import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit3, Upload, Download, Type, Highlighter, MessageSquare, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { PDFDocument, rgb } from "pdf-lib";

const PdfAnnotator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [annotationType, setAnnotationType] = useState("comment");
  const [annotationText, setAnnotationText] = useState("");
  const [annotations, setAnnotations] = useState<Array<{type: string, text: string}>>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const addAnnotation = () => {
    if (!annotationText.trim()) {
      alert("Please enter annotation text");
      return;
    }
    
    setAnnotations(prev => [...prev, { type: annotationType, text: annotationText }]);
    setAnnotationText("");
  };

  const savePDF = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }
    
    if (annotations.length === 0) {
      alert("Please add at least one annotation");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      
      // Add annotations to the first page
      let yPosition = firstPage.getHeight() - 50;
      
      annotations.forEach((annotation, index) => {
        const text = `${annotation.type.toUpperCase()}: ${annotation.text}`;
        
        // Add text annotation
        firstPage.drawText(text, {
          x: 50,
          y: yPosition - (index * 30),
          size: 12,
          color: annotation.type === 'highlight' ? rgb(1, 1, 0) : rgb(1, 0, 0),
        });
      });
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `annotated-${file.name}`;
      a.click();
      
      URL.revokeObjectURL(url);
      
      alert(`PDF annotated successfully with ${annotations.length} annotations!`);
    } catch (error) {
      console.error('Error annotating PDF:', error);
      alert('Error annotating PDF. Please make sure the file is a valid PDF document.');
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-2xl mb-4">
              <Edit3 className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              PDF Annotator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Add comments, highlights, or stamps
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
                    {file ? file.name : "Select a PDF file to annotate"}
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
                  Annotation Tools
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={annotationType === "comment" ? "default" : "outline"}
                    onClick={() => setAnnotationType("comment")}
                    className="flex flex-col h-auto py-4"
                  >
                    <MessageSquare className="w-6 h-6 mb-2" />
                    <span className="text-sm">Comment</span>
                  </Button>
                  <Button
                    variant={annotationType === "highlight" ? "default" : "outline"}
                    onClick={() => setAnnotationType("highlight")}
                    className="flex flex-col h-auto py-4"
                  >
                    <Highlighter className="w-6 h-6 mb-2" />
                    <span className="text-sm">Highlight</span>
                  </Button>
                  <Button
                    variant={annotationType === "text" ? "default" : "outline"}
                    onClick={() => setAnnotationType("text")}
                    className="flex flex-col h-auto py-4"
                  >
                    <Type className="w-6 h-6 mb-2" />
                    <span className="text-sm">Text</span>
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Annotation Text
                </label>
                <Input
                  placeholder="Enter your annotation text..."
                  value={annotationText}
                  onChange={(e) => setAnnotationText(e.target.value)}
                />
              </div>

              <Button 
                onClick={addAnnotation} 
                className="w-full"
                disabled={!file || !annotationText}
              >
                Add Annotation
              </Button>

              {annotations.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Annotations ({annotations.length})
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {annotations.map((annotation, index) => (
                      <div key={index} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                          {annotation.type}
                        </span>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {annotation.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                onClick={savePDF} 
                className="w-full"
                disabled={!file || annotations.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Save Annotated PDF
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PdfAnnotator;