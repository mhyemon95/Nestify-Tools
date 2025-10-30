import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Download, Upload, Zap, Expand, Shrink } from "lucide-react";

const ImageSizeCompressor = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [originalFileSize, setOriginalFileSize] = useState<number>(0);
  const [processedFileSize, setProcessedFileSize] = useState<number>(0);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [processedDimensions, setProcessedDimensions] = useState({ width: 0, height: 0 });
  const [quality, setQuality] = useState<number>(80); // Default quality 80%
  const [scale, setScale] = useState<number>(100); // Default scale 100%
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainAspect, setMaintainAspect] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Update width/height when scale changes
  useEffect(() => {
    if (originalDimensions.width && originalDimensions.height) {
      const newWidth = Math.round(originalDimensions.width * scale / 100);
      const newHeight = Math.round(originalDimensions.height * scale / 100);
      setWidth(newWidth);
      setHeight(newHeight);
    }
  }, [scale, originalDimensions]);

  // Update scale when width changes (if maintaining aspect ratio)
  useEffect(() => {
    if (maintainAspect && originalDimensions.width) {
      const newScale = Math.round((width / originalDimensions.width) * 100);
      setScale(newScale);
    }
  }, [width, maintainAspect, originalDimensions]);

  // Update scale when height changes (if maintaining aspect ratio)
  useEffect(() => {
    if (maintainAspect && originalDimensions.height) {
      const newScale = Math.round((height / originalDimensions.height) * 100);
      setScale(newScale);
    }
  }, [height, maintainAspect, originalDimensions]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalFileSize(file.size);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setOriginalImage(event.target?.result as string);
          setProcessedImage(null);
          setProcessedFileSize(0);
          setOriginalDimensions({ width: img.width, height: img.height });
          setProcessedDimensions({ width: img.width, height: img.height });
          setWidth(img.width);
          setHeight(img.height);
          toast.success("Image loaded successfully!");
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = () => {
    if (!originalImage || !canvasRef.current) return;

    setIsProcessing(true);
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      const img = new Image();
      img.onload = () => {
        // Set canvas dimensions to match desired output size
        canvas.width = width;
        canvas.height = height;
        
        // Draw resized image on canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get processed image data
        const processedDataUrl = canvas.toDataURL("image/jpeg", quality / 100);
        setProcessedImage(processedDataUrl);
        
        // Calculate processed file size
        const base64Size = processedDataUrl.length;
        const fileSize = Math.round((base64Size * 3) / 4 - (processedDataUrl.match(/=+$/) ?? [""]).length);
        setProcessedFileSize(fileSize);
        setProcessedDimensions({ width, height });
        
        setIsProcessing(false);
        toast.success("Image processed successfully!");
      };
      img.src = originalImage;
    } catch (error) {
      setIsProcessing(false);
      toast.error("Failed to process image");
      console.error("Processing error:", error);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;
    
    const link = document.createElement("a");
    link.download = `processed-image-${width}x${height}-${quality}-quality.jpg`;
    link.href = processedImage;
    link.click();
    toast.success("Processed image downloaded!");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const calculateSavings = (): string => {
    if (originalFileSize === 0 || processedFileSize === 0) return "0%";
    const savings = ((originalFileSize - processedFileSize) / originalFileSize) * 100;
    return savings.toFixed(1) + "%";
  };

  return (
    <ToolLayout
      title="Image Size Compressor"
      description="Resize and compress images to reduce or increase file sizes while maintaining quality"
    >
      <div className="space-y-6">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
            disabled={isProcessing}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
        </div>

        {originalImage && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="scale">Scale: {scale}%</Label>
                  <Input
                    id="scale"
                    type="range"
                    min="10"
                    max="200"
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-full"
                    disabled={isProcessing}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>50%</span>
                    <span>100%</span>
                    <span>200%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width">Width (px)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      min={1}
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (px)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      min={1}
                      disabled={isProcessing}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="maintain-aspect"
                    checked={maintainAspect}
                    onChange={(e) => setMaintainAspect(e.target.checked)}
                    className="rounded"
                    disabled={isProcessing}
                  />
                  <Label htmlFor="maintain-aspect" className="text-sm">
                    Maintain aspect ratio
                  </Label>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quality">Quality: {quality}%</Label>
                  <Input
                    id="quality"
                    type="range"
                    min="1"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full"
                    disabled={isProcessing}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Low Quality</span>
                    <span>High Quality</span>
                  </div>
                </div>
                
                <Button 
                  onClick={processImage} 
                  className="w-full bg-primary mt-4"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-pulse" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Process Image
                    </>
                  )}
                </Button>
              </div>
            </div>

            {processedImage && (
              <div className="flex flex-wrap gap-3">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium">Original</p>
                  <p className="text-sm">{formatFileSize(originalFileSize)}</p>
                  <p className="text-sm">{originalDimensions.width}×{originalDimensions.height}px</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium">Processed</p>
                  <p className="text-sm">{formatFileSize(processedFileSize)}</p>
                  <p className="text-sm">{processedDimensions.width}×{processedDimensions.height}px</p>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="text-sm font-medium">Savings</p>
                  <p className="text-sm text-primary">{calculateSavings()}</p>
                </div>
                <Button 
                  onClick={downloadImage} 
                  variant="outline" 
                  className="ml-auto flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Original</h3>
                <img 
                  src={originalImage} 
                  alt="Original" 
                  className="w-full rounded-lg border max-h-[500px] object-contain" 
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Size: {formatFileSize(originalFileSize)} | Dimensions: {originalDimensions.width}×{originalDimensions.height}px
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Processed</h3>
                {processedImage ? (
                  <>
                    <img 
                      src={processedImage} 
                      alt="Processed" 
                      className="w-full rounded-lg border max-h-[500px] object-contain" 
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Size: {formatFileSize(processedFileSize)} | Dimensions: {processedDimensions.width}×{processedDimensions.height}px
                    </p>
                  </>
                ) : (
                  <div className="w-full h-64 rounded-lg border flex items-center justify-center bg-muted">
                    <p className="text-muted-foreground">Processed image will appear here</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}
      </div>
    </ToolLayout>
  );
};

export default ImageSizeCompressor;