import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";
import { toast } from "sonner";

const QRGenerator = () => {
  const [text, setText] = useState("");
  const [size, setSize] = useState(256);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fgColor, setFgColor] = useState("#000000");

  const downloadQR = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = "qrcode.png";
      downloadLink.href = pngFile;
      downloadLink.click();
      toast.success("QR code downloaded!");
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Create customizable QR codes for links or text"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <Label htmlFor="text">Text or URL</Label>
            <Textarea
              id="text"
              placeholder="Enter text or URL to encode..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="size">Size (px): {size}</Label>
            <Input
              id="size"
              type="range"
              min="128"
              max="512"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fgColor">Foreground Color</Label>
              <div className="flex gap-2">
                <Input
                  id="fgColor"
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bgColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="bgColor"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          {text ? (
            <>
              <div className="p-6 bg-muted rounded-lg">
                <QRCodeSVG
                  id="qr-code"
                  value={text}
                  size={size}
                  bgColor={bgColor}
                  fgColor={fgColor}
                  level="H"
                />
              </div>
              <Button onClick={downloadQR} className="w-full bg-gradient-to-r from-primary to-accent">
                <Download className="w-4 h-4 mr-2" />
                Download QR Code
              </Button>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Enter text to generate QR code
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
};

export default QRGenerator;
