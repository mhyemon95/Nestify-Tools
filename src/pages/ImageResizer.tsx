import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Download, Upload } from "lucide-react";

const ImageResizer = () => {
  const [image, setImage] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(event.target?.result as string);
          setWidth(img.width);
          setHeight(img.height);
          setAspectRatio(img.width / img.height);
          toast.success("Image loaded successfully!");
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWidthChange = (value: number) => {
    setWidth(value);
    if (maintainAspect && aspectRatio) {
      setHeight(Math.round(value / aspectRatio));
    }
  };

  const handleHeightChange = (value: number) => {
    setHeight(value);
    if (maintainAspect && aspectRatio) {
      setWidth(Math.round(value * aspectRatio));
    }
  };

  const resizeImage = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      toast.success("Image resized!");
    };
    img.src = image;
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `resized-image-${width}x${height}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
    toast.success("Image downloaded!");
  };

  return (
    <ToolLayout
      title="Image Resizer"
      description="Resize or crop images with live preview"
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
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
        </div>

        {image && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="width">Width (px)</Label>
                <Input
                  id="width"
                  type="number"
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  min={1}
                />
              </div>
              <div>
                <Label htmlFor="height">Height (px)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  min={1}
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintainAspect}
                    onChange={(e) => setMaintainAspect(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Maintain aspect ratio</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={resizeImage} className="flex-1 bg-primary">
                Resize Image
              </Button>
              <Button onClick={downloadImage} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Original</h3>
                <img src={image} alt="Original" className="w-full rounded-lg border" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Preview</h3>
                <canvas
                  ref={canvasRef}
                  className="w-full rounded-lg border bg-muted"
                  style={{ maxHeight: "400px", objectFit: "contain" }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
};

export default ImageResizer;
