import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Upload, Download, Pen, Image, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import { Document, Page, pdfjs } from "react-pdf";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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

interface DraggableSignatureProps {
  signature: Signature;
  onUpdate: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  onRemove: (id: string) => void;
  scale: number;
}

const DraggableSignature = ({ signature, onUpdate, onResize, onRemove, scale }: DraggableSignatureProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, mouseX: 0, mouseY: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      width: signature.width,
      height: signature.height,
      mouseX: e.clientX,
      mouseY: e.clientY
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const container = document.getElementById(`pdf-page-${signature.pageIndex}`);
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newX = (e.clientX - containerRect.left - dragOffset.x) / scale;
      const newY = (e.clientY - containerRect.top - dragOffset.y) / scale;

      onUpdate(signature.id, Math.max(0, newX), Math.max(0, newY));
    } else if (isResizing) {
      const deltaX = (e.clientX - resizeStart.mouseX) / scale;
      const deltaY = (e.clientY - resizeStart.mouseY) / scale;

      // Maintain aspect ratio
      const aspectRatio = resizeStart.width / resizeStart.height;
      const delta = Math.max(deltaX, deltaY);

      const newWidth = Math.max(50, resizeStart.width + delta);
      const newHeight = Math.max(25, newWidth / aspectRatio);

      onResize(signature.id, newWidth, newHeight);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing]);

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: `${signature.x * scale}px`,
        top: `${signature.y * scale}px`,
        width: `${signature.width * scale}px`,
        height: `${signature.height * scale}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        border: '2px dashed #3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        zIndex: 10
      }}
      className="group"
    >
      <img
        src={signature.data}
        alt="Signature"
        className="w-full h-full object-contain pointer-events-none"
        draggable={false}
      />
      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(signature.id);
        }}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-3 h-3" />
      </button>
      {/* Resize handle */}
      <div
        onMouseDown={handleResizeMouseDown}
        className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ zIndex: 11 }}
      />
    </div>
  );
};

const PdfESign = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
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
        setPageNumber(1);
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
          x: 100,
          y: 100,
          width: 150,
          height: 75,
          pageIndex: pageNumber - 1
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
        x: 100,
        y: 100,
        width: 150,
        height: 75,
        pageIndex: pageNumber - 1
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

  const updateSignaturePosition = (id: string, x: number, y: number) => {
    setSignatures(prev => prev.map(sig =>
      sig.id === id ? { ...sig, x, y } : sig
    ));
  };

  const updateSignatureSize = (id: string, width: number, height: number) => {
    setSignatures(prev => prev.map(sig =>
      sig.id === id ? { ...sig, width, height } : sig
    ));
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

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
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
              Add digital signatures to your PDF documents - drag to position
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Controls */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload PDF File
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {file ? file.name : "Select a PDF"}
                      </p>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="pdf-upload"
                      />
                      <Button asChild size="sm">
                        <label htmlFor="pdf-upload" className="cursor-pointer">
                          Select PDF
                        </label>
                      </Button>
                    </div>
                  </div>

                  {file && (
                    <>
                      <div className="space-y-2">
                        <Button
                          onClick={() => setShowSignaturePad(true)}
                          variant="outline"
                          className="w-full"
                          size="sm"
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
                          <Button asChild variant="outline" className="w-full" size="sm">
                            <label htmlFor="signature-upload" className="cursor-pointer">
                              <Image className="w-4 h-4 mr-2" />
                              Upload Signature
                            </label>
                          </Button>
                        </div>
                      </div>

                      {numPages > 1 && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Current Page: {pageNumber} / {numPages}
                          </label>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                              disabled={pageNumber <= 1}
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              Previous
                            </Button>
                            <Button
                              onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
                              disabled={pageNumber >= numPages}
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Signatures on Page {pageNumber}: {signatures.filter(s => s.pageIndex === pageNumber - 1).length}
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Drag to position • Drag corner to resize
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              {file && (
                <Button
                  onClick={downloadSignedPdf}
                  className="w-full"
                  disabled={signatures.length === 0 || isProcessing}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isProcessing ? "Processing..." : "Download Signed PDF"}
                </Button>
              )}
            </div>

            {/* Right Panel - PDF Viewer */}
            <div className="lg:col-span-2">
              {file ? (
                <Card className="p-4">
                  <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto" style={{ maxHeight: '800px' }}>
                    <Document
                      file={file}
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      <div id={`pdf-page-${pageNumber - 1}`} className="relative inline-block">
                        <Page
                          pageNumber={pageNumber}
                          scale={scale}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                        {signatures
                          .filter(sig => sig.pageIndex === pageNumber - 1)
                          .map(signature => (
                            <DraggableSignature
                              key={signature.id}
                              signature={signature}
                              onUpdate={updateSignaturePosition}
                              onResize={updateSignatureSize}
                              onRemove={removeSignature}
                              scale={scale}
                            />
                          ))}
                      </div>
                    </Document>
                  </div>
                  <div className="mt-4 flex justify-center gap-2">
                    <Button
                      onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
                      size="sm"
                      variant="outline"
                    >
                      Zoom Out
                    </Button>
                    <span className="px-4 py-2 text-sm">{Math.round(scale * 100)}%</span>
                    <Button
                      onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
                      size="sm"
                      variant="outline"
                    >
                      Zoom In
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className="p-12">
                  <div className="text-center text-gray-500">
                    <Upload className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">Upload a PDF to get started</p>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Signature Pad Modal */}
          {showSignaturePad && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <Card className="p-6 max-w-lg w-full">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfESign;