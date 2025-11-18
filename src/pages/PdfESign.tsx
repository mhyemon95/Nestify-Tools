import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Upload, Download, Pen, Image, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { PDFDocument } from "pdf-lib";

interface Signature {
  id: string;
  type: 'draw' | 'upload';
  data: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pageIndex: number;
}

const SignatureCanvas = ({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement> }) => {
  const isDrawing = useRef(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={200}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      className="border border-gray-300 dark:border-gray-600 rounded-lg w-full cursor-crosshair bg-white dark:bg-gray-800"
    />
  );
};

const PdfESign = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const signatureRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const loadedPdf = await PDFDocument.load(arrayBuffer);
        setPdfDoc(loadedPdf);
        setSignatures([]);
      } catch (error) {
        console.error('Error loading PDF:', error);
        alert('Error loading PDF. Please make sure the file is a valid PDF document.');
      }
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const signature: Signature = {
          id: Date.now().toString(),
          type: 'upload',
          data: event.target?.result as string,
          x: 50,
          y: 50,
          width: 150,
          height: 75,
          pageIndex: 0
        };
        setSignatures(prev => [...prev, signature]);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveDrawnSignature = () => {
    const canvas = signatureRef.current;
    if (canvas) {
      const signatureData = canvas.toDataURL();
      const signature: Signature = {
        id: Date.now().toString(),
        type: 'draw',
        data: signatureData,
        x: 50,
        y: 50,
        width: 150,
        height: 75,
        pageIndex: 0
      };
      setSignatures(prev => [...prev, signature]);
      clearSignaturePad();
      setShowSignaturePad(false);
    }
  };

  const clearSignaturePad = () => {
    const canvas = signatureRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const removeSignature = (id: string) => {
    setSignatures(prev => prev.filter(sig => sig.id !== id));
  };

  const downloadSignedPdf = async () => {
    if (!file || !pdfDoc || signatures.length === 0) {
      alert("Please upload a PDF and add at least one signature");
      return;
    }

    setIsProcessing(true);
    try {
      const pdfDocCopy = await PDFDocument.load(await file.arrayBuffer());
      
      for (const signature of signatures) {
        const page = pdfDocCopy.getPage(signature.pageIndex);
        const { width: pageWidth, height: pageHeight } = page.getSize();
        
        const imageBytes = await fetch(signature.data).then(res => res.arrayBuffer());
        const image = signature.data.includes('data:image/png') 
          ? await pdfDocCopy.embedPng(imageBytes)
          : await pdfDocCopy.embedJpg(imageBytes);
        
        page.drawImage(image, {
          x: signature.x,
          y: pageHeight - signature.y - signature.height,
          width: signature.width,
          height: signature.height,
        });
      }
      
      const pdfBytes = await pdfDocCopy.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace('.pdf', '') + '-signed.pdf';
      a.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error signing PDF:', error);
      alert('Error signing PDF. Please try again.');
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-2xl mb-4">
              <Pen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              eSign PDF
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Add digital signatures to your PDF documents
            </p>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload PDF File
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {file ? file.name : "Select a PDF file to sign"}
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

                {file && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      onClick={() => setShowSignaturePad(true)}
                      variant="outline"
                      className="w-full"
                    >
                      <Pen className="w-4 h-4 mr-2" />
                      Draw Signature
                    </Button>
                    
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSignatureUpload}
                        className="hidden"
                        id="signature-upload"
                      />
                      <Button asChild variant="outline" className="w-full">
                        <label htmlFor="signature-upload" className="cursor-pointer">
                          <Image className="w-4 h-4 mr-2" />
                          Upload Signature
                        </label>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {showSignaturePad && (
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Draw Your Signature
                </h3>
                <SignatureCanvas canvasRef={signatureRef} />
                <div className="flex gap-2 mt-4">
                  <Button onClick={saveDrawnSignature}>
                    Save Signature
                  </Button>
                  <Button onClick={clearSignaturePad} variant="outline">
                    Clear
                  </Button>
                  <Button 
                    onClick={() => setShowSignaturePad(false)} 
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            )}

            {signatures.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Added Signatures ({signatures.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {signatures.map((signature) => (
                    <div key={signature.id} className="relative border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <img 
                        src={signature.data} 
                        alt="Signature" 
                        className="w-full h-20 object-contain mb-2"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Type: {signature.type === 'draw' ? 'Drawn' : 'Uploaded'}
                      </p>
                      <Button
                        onClick={() => removeSignature(signature.id)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Button 
              onClick={downloadSignedPdf} 
              className="w-full" 
              size="lg"
              disabled={!file || signatures.length === 0 || isProcessing}
            >
              <Download className="w-4 h-4 mr-2" />
              {isProcessing ? "Processing..." : "Download Signed PDF"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfESign;