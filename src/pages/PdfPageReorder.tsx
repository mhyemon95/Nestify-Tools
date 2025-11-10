import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Upload, Download, RotateCw, GripVertical, X } from "lucide-react";
import { Link } from "react-router-dom";
import { PDFDocument, degrees } from "pdf-lib";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PageInfo {
  index: number;
  rotation: number; // 0, 90, 180, 270
}

const PdfPageReorder = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const loadedPdf = await PDFDocument.load(arrayBuffer);
        const pageCount = loadedPdf.getPageCount();
        setTotalPages(pageCount);
        setPdfDoc(loadedPdf);
        
        // Initialize pages array with default rotation
        const initialPages: PageInfo[] = Array.from({ length: pageCount }, (_, i) => ({
          index: i,
          rotation: 0,
        }));
        setPages(initialPages);
      } catch (error) {
        console.error('Error reading PDF:', error);
        alert('Error reading PDF. Please make sure the file is a valid PDF document.');
        setFile(null);
        setPages([]);
        setTotalPages(0);
        setPdfDoc(null);
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setPages((items) => {
        const oldIndex = items.findIndex((item) => item.index.toString() === active.id);
        const newIndex = items.findIndex((item) => item.index.toString() === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const rotatePage = (pageIndex: number, rotation: number) => {
    setPages((prevPages) => {
      const newPages = [...prevPages];
      const page = newPages.find((p) => p.index === pageIndex);
      if (page) {
        // Normalize rotation to 0-359 range
        page.rotation = ((page.rotation + rotation) % 360 + 360) % 360;
      }
      return newPages;
    });
  };

  const processPDF = async () => {
    if (!file || !pdfDoc || pages.length === 0) {
      alert("Please select a PDF file");
      return;
    }

    try {
      const newPdf = await PDFDocument.create();
      
      // Copy pages in the new order with their rotations
      for (const pageInfo of pages) {
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageInfo.index]);
        const page = newPdf.addPage(copiedPage);
        
        // Apply rotation (normalize to 0, 90, 180, or 270)
        const normalizedRotation = ((pageInfo.rotation % 360) + 360) % 360;
        if (normalizedRotation !== 0) {
          const rotationAngle = normalizedRotation as 90 | 180 | 270;
          page.setRotation(degrees(rotationAngle));
        }
      }
      
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace('.pdf', '') + '-reordered.pdf';
      a.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Error processing PDF. Please try again.');
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
              <RotateCw className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              PDF Page Reorder
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Rearrange or rotate specific pages
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
                    {file ? file.name : "Select a PDF file to reorder or rotate pages"}
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

              {pages.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Pages ({pages.length}) - Drag to reorder, click rotate to change orientation
                  </h3>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext items={pages.map((p) => p.index.toString())} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {pages.map((pageInfo) => (
                          <SortablePageItem
                            key={pageInfo.index}
                            id={pageInfo.index.toString()}
                            pageNumber={pages.findIndex((p) => p.index === pageInfo.index) + 1}
                            originalPageNumber={pageInfo.index + 1}
                            rotation={pageInfo.rotation}
                            onRotate={(rotation) => rotatePage(pageInfo.index, rotation)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}

              <Button 
                onClick={processPDF} 
                className="w-full" 
                size="lg"
                disabled={!file || pages.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Reordered PDF
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface SortablePageItemProps {
  id: string;
  pageNumber: number;
  originalPageNumber: number;
  rotation: number;
  onRotate: (rotation: number) => void;
}

const SortablePageItem = ({ id, pageNumber, originalPageNumber, rotation, onRotate }: SortablePageItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center gap-3 flex-1">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Page {pageNumber} {pageNumber !== originalPageNumber && `(was ${originalPageNumber})`}
          </div>
          {rotation !== 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Rotated {rotation}°
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRotate(90)}
          title="Rotate 90° clockwise"
        >
          <RotateCw className="w-4 h-4 mr-1" />
          90°
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRotate(180)}
          title="Rotate 180°"
        >
          <RotateCw className="w-4 h-4 mr-1" />
          180°
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRotate(270)}
          title="Rotate 270° clockwise (90° counter-clockwise)"
        >
          <RotateCw className="w-4 h-4 mr-1" />
          270°
        </Button>
      </div>
    </div>
  );
};

export default PdfPageReorder;

