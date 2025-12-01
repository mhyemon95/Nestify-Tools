import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Download, Upload, Copy } from "lucide-react";
import JSZip from "jszip";

const FAVICON_SIZES = [16, 32, 48, 64, 128, 256];

const FaviconGenerator = () => {
    const [image, setImage] = useState<string | null>(null);
    const [favicons, setFavicons] = useState<{ size: number; dataUrl: string }[]>([]);
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [padding, setPadding] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result as string);
                generateFavicons(reader.result as string);
                toast.success("Image loaded successfully!");
            };
            reader.readAsDataURL(file);
        }
    };

    const generateFavicons = (imageData: string) => {
        const img = new Image();
        img.src = imageData;

        img.onload = () => {
            const generatedFavicons = FAVICON_SIZES.map((size) => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) return null;

                canvas.width = size;
                canvas.height = size;

                // Fill background if padding is applied
                if (padding > 0) {
                    ctx.fillStyle = backgroundColor;
                    ctx.fillRect(0, 0, size, size);
                }

                // Calculate dimensions with padding
                const paddingPx = (size * padding) / 100;
                const drawSize = size - paddingPx * 2;

                ctx.drawImage(img, paddingPx, paddingPx, drawSize, drawSize);

                return {
                    size,
                    dataUrl: canvas.toDataURL("image/png"),
                };
            }).filter(Boolean) as { size: number; dataUrl: string }[];

            setFavicons(generatedFavicons);
            toast.success("Favicons generated!");
        };
    };

    const downloadSingle = (size: number, dataUrl: string) => {
        const link = document.createElement("a");
        link.download = `favicon-${size}x${size}.png`;
        link.href = dataUrl;
        link.click();
        toast.success(`${size}x${size} favicon downloaded!`);
    };

    const downloadAll = async () => {
        if (favicons.length === 0) {
            toast.error("Please generate favicons first");
            return;
        }

        const zip = new JSZip();

        favicons.forEach(({ size, dataUrl }) => {
            const base64Data = dataUrl.split(",")[1];
            zip.file(`favicon-${size}x${size}.png`, base64Data, { base64: true });
        });

        const blob = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.download = "favicons.zip";
        link.href = URL.createObjectURL(blob);
        link.click();
        toast.success("All favicons downloaded as ZIP!");
    };

    const copyHtmlCode = () => {
        const htmlCode = `<!-- Favicon Links -->
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="apple-touch-icon" sizes="180x180" href="/favicon-256x256.png">
<link rel="manifest" href="/site.webmanifest">`;

        navigator.clipboard.writeText(htmlCode);
        toast.success("HTML code copied to clipboard!");
    };

    return (
        <ToolLayout
            title="Favicon Generator"
            description="Create favicons in multiple sizes for your website"
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
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                    </Button>
                </div>

                {image && (
                    <>
                        {/* Customization Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="padding">Padding: {padding}%</Label>
                                <input
                                    id="padding"
                                    type="range"
                                    min={0}
                                    max={30}
                                    value={padding}
                                    onChange={(e) => {
                                        setPadding(Number(e.target.value));
                                        if (image) generateFavicons(image);
                                    }}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label htmlFor="bgColor">Background Color</Label>
                                <div className="flex gap-2">
                                    <input
                                        id="bgColor"
                                        type="color"
                                        value={backgroundColor}
                                        onChange={(e) => {
                                            setBackgroundColor(e.target.value);
                                            if (image) generateFavicons(image);
                                        }}
                                        className="h-10 w-20"
                                    />
                                    <Input
                                        value={backgroundColor}
                                        onChange={(e) => {
                                            setBackgroundColor(e.target.value);
                                            if (image) generateFavicons(image);
                                        }}
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Favicon Preview Grid */}
                        {favicons.length > 0 && (
                            <>
                                <div>
                                    <Label className="mb-3 block">Generated Favicons</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {favicons.map(({ size, dataUrl }) => (
                                            <div
                                                key={size}
                                                className="border rounded-lg p-4 bg-muted flex flex-col items-center gap-3"
                                            >
                                                <div
                                                    className="bg-white rounded flex items-center justify-center border"
                                                    style={{ width: "80px", height: "80px" }}
                                                >
                                                    <img
                                                        src={dataUrl}
                                                        alt={`${size}x${size}`}
                                                        style={{ width: `${Math.min(size, 64)}px`, height: `${Math.min(size, 64)}px` }}
                                                    />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-semibold">{size}x{size}</p>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => downloadSingle(size, dataUrl)}
                                                        className="mt-2"
                                                    >
                                                        <Download className="w-3 h-3 mr-1" />
                                                        Download
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Download All Button */}
                                <Button onClick={downloadAll} className="w-full bg-primary">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download All as ZIP
                                </Button>

                                {/* HTML Code Snippet */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <Label>HTML Implementation Code</Label>
                                        <Button size="sm" variant="outline" onClick={copyHtmlCode}>
                                            <Copy className="w-4 h-4 mr-2" />
                                            Copy Code
                                        </Button>
                                    </div>
                                    <div className="bg-muted p-4 rounded-lg">
                                        <pre className="text-xs overflow-x-auto">
                                            {`<!-- Favicon Links -->
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="apple-touch-icon" sizes="180x180" href="/favicon-256x256.png">
<link rel="manifest" href="/site.webmanifest">`}
                                        </pre>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </ToolLayout>
    );
};

export default FaviconGenerator;
