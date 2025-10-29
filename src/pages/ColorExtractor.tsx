import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Upload, Copy } from "lucide-react";
import { toast } from "sonner";

interface ColorData {
  hex: string;
  rgb: string;
  count: number;
}

const ColorExtractor = () => {
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<ColorData[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        extractColors(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractColors = (imageSrc: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const colorMap = new Map<string, number>();

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
      }

      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([hex, count]) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return {
            hex,
            rgb: `rgb(${r}, ${g}, ${b})`,
            count,
          };
        });

      setColors(sortedColors);
      toast.success("Colors extracted!");
    };
    img.src = imageSrc;
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success(`Copied ${color}!`);
  };

  return (
    <ToolLayout
      title="Color Palette Extractor"
      description="Extract dominant colors from images"
    >
      <div className="space-y-6">
        <div className="text-center">
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <label htmlFor="image-upload">
            <Button asChild className="bg-gradient-to-r from-primary to-accent cursor-pointer">
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </span>
            </Button>
          </label>
        </div>

        {image && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Image Preview</h3>
              <img src={image} alt="Uploaded" className="w-full rounded-lg border" />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div>
              <h3 className="font-semibold mb-3">Top 10 Colors</h3>
              <div className="space-y-2">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div
                      className="w-12 h-12 rounded border-2 border-border flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-sm font-semibold">{color.hex}</div>
                      <div className="font-mono text-xs text-muted-foreground">{color.rgb}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyColor(color.hex)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default ColorExtractor;
