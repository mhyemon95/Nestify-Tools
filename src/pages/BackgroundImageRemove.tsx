import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Download, Upload, Zap, Palette, Eye } from "lucide-react";
import { removeBackground } from "@imgly/background-removal";

const BackgroundImageRemove = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [transparentImage, setTransparentImage] = useState<string | null>(null); // Store transparent version
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bgColor, setBgColor] = useState("#ffffff"); // Default to white
  const [blurAmount, setBlurAmount] = useState(5); // Default blur amount
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
        setProcessedImage(null);
        setTransparentImage(null);
        toast.success("Image loaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackgroundFromImage = async () => {
    if (!originalImage) return;

    try {
      setIsLoading(true);
      setProgress(0);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      // Process the image
      const blob = await removeBackground(originalImage);
      clearInterval(progressInterval);
      setProgress(100);
      
      // Convert blob to data URL
      const reader = new FileReader();
      reader.onload = () => {
        const transparentImg = reader.result as string;
        setTransparentImage(transparentImg);
        setProcessedImage(transparentImg); // Initially show transparent version
        setIsLoading(false);
        toast.success("Background removed successfully!");
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to remove background. Please try another image.");
      console.error("Background removal error:", error);
    }
  };

  const changeBackgroundColor = () => {
    if (!transparentImage) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Fill with the selected background color
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the transparent image on top
      ctx.drawImage(img, 0, 0);

      // Update the processed image with the new background
      setProcessedImage(canvas.toDataURL("image/png"));
      toast.success("Background color changed!");
    };
    img.src = transparentImage; // Always use the transparent version
  };

  const applyBackgroundBlur = () => {
    if (!originalImage || !transparentImage) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const originalImg = new Image();
    const transparentImg = new Image();

    originalImg.onload = () => {
      transparentImg.onload = () => {
        canvas.width = originalImg.width;
        canvas.height = originalImg.height;

        // Draw the original image (to be blurred)
        ctx.filter = `blur(${blurAmount}px)`;
        ctx.drawImage(originalImg, 0, 0);
        ctx.filter = "none";

        // Draw the foreground image with transparent background on top
        ctx.drawImage(transparentImg, 0, 0);

        // Update the processed image with the blurred background
        setProcessedImage(canvas.toDataURL("image/png"));
        toast.success("Background blur applied!");
      };
      transparentImg.src = transparentImage;
    };
    originalImg.src = originalImage;
  };

  const downloadImage = () => {
    if (!processedImage) return;
    
    const link = document.createElement("a");
    link.download = "background-removed-image.png";
    link.href = processedImage;
    link.click();
    toast.success("Image downloaded!");
  };

  return (
    <ToolLayout
      title="Background Image Remove"
      description="Automatically remove backgrounds from your images with AI-powered technology"
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
            disabled={isLoading}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
        </div>

        {originalImage && (
          <>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={removeBackgroundFromImage} 
                className="flex-1 min-w-[200px] bg-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-pulse" />
                    Removing Background... {progress}%
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Remove Background
                  </>
                )}
              </Button>
              {processedImage && (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="bg-color" className="mr-2 whitespace-nowrap">
                        BG Color:
                      </Label>
                      <div className="relative">
                        <Input
                          id="bg-color"
                          type="color"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={changeBackgroundColor}
                      variant="outline"
                      className="flex items-center"
                    >
                      <Palette className="w-4 h-4 mr-2" />
                      Apply
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="blur-amount" className="mr-2 whitespace-nowrap">
                        Blur:
                      </Label>
                      <Input
                        id="blur-amount"
                        type="range"
                        min="0"
                        max="20"
                        value={blurAmount}
                        onChange={(e) => setBlurAmount(Number(e.target.value))}
                        className="w-24"
                      />
                      <span className="ml-2 text-sm w-8">{blurAmount}px</span>
                    </div>
                    <Button 
                      onClick={applyBackgroundBlur}
                      variant="outline"
                      className="flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Apply
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={downloadImage} 
                    variant="outline" 
                    className="flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Original</h3>
                <img 
                  src={originalImage} 
                  alt="Original" 
                  className="w-full rounded-lg border max-h-[500px] object-contain" 
                />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Background Removed</h3>
                {isLoading ? (
                  <div className="w-full h-64 rounded-lg border flex items-center justify-center bg-muted">
                    <div className="text-center">
                      <Zap className="w-8 h-8 mx-auto text-primary animate-pulse mb-2" />
                      <p>Processing image...</p>
                      <p className="text-sm text-muted-foreground">{progress}% complete</p>
                    </div>
                  </div>
                ) : processedImage ? (
                  <img 
                    src={processedImage} 
                    alt="Background Removed" 
                    className="w-full rounded-lg border max-h-[500px] object-contain" 
                  />
                ) : (
                  <div className="w-full h-64 rounded-lg border flex items-center justify-center bg-muted">
                    <p className="text-muted-foreground">Processed image will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
};

export default BackgroundImageRemove;