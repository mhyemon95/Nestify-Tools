import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Download, Upload, FileCode } from "lucide-react";

const SCALE_OPTIONS = [
    { label: "1x", value: 1 },
    { label: "2x (Retina)", value: 2 },
    { label: "3x", value: 3 },
    { label: "4x", value: 4 },
];

const SvgToPngConverter = () => {
    const [svgContent, setSvgContent] = useState("");
    const [svgDataUrl, setSvgDataUrl] = useState<string | null>(null);
    const [width, setWidth] = useState(512);
    const [height, setHeight] = useState(512);
    const [scale, setScale] = useState(1);
    const [backgroundColor, setBackgroundColor] = useState("transparent");
    const [customBgColor, setCustomBgColor] = useState("#ffffff");
    const [useOriginalSize, setUseOriginalSize] = useState(true);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === "image/svg+xml") {
            const reader = new FileReader();
            reader.onload = () => {
                const content = reader.result as string;
                setSvgContent(content);
                processSvg(content);
                toast.success("SVG file loaded!");
            };
            reader.readAsText(file);
        } else {
            toast.error("Please upload a valid SVG file");
        }
    };

    const handleSvgPaste = () => {
        if (svgContent.trim()) {
            processSvg(svgContent);
            toast.success("SVG content processed!");
        } else {
            toast.error("Please paste SVG content first");
        }
    };

    const processSvg = (content: string) => {
        try {
            // Create a blob from SVG content
            const blob = new Blob([content], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            setSvgDataUrl(url);

            // Try to extract original dimensions
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(content, "image/svg+xml");
            const svgElement = svgDoc.querySelector("svg");

            if (svgElement) {
                const viewBox = svgElement.getAttribute("viewBox");
                const svgWidth = svgElement.getAttribute("width");
                const svgHeight = svgElement.getAttribute("height");

                if (viewBox) {
                    const [, , vbWidth, vbHeight] = viewBox.split(" ").map(Number);
                    setWidth(vbWidth || 512);
                    setHeight(vbHeight || 512);
                } else if (svgWidth && svgHeight) {
                    setWidth(parseInt(svgWidth) || 512);
                    setHeight(parseInt(svgHeight) || 512);
                }
            }
        } catch (error) {
            toast.error("Invalid SVG content");
        }
    };

    const convertToPng = async () => {
        if (!svgDataUrl || !canvasRef.current) {
            toast.error("Please load an SVG first");
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const finalWidth = useOriginalSize ? width * scale : width;
        const finalHeight = useOriginalSize ? height * scale : height;

        canvas.width = finalWidth;
        canvas.height = finalHeight;

        // Set background
        if (backgroundColor !== "transparent") {
            ctx.fillStyle = backgroundColor === "custom" ? customBgColor : backgroundColor;
            ctx.fillRect(0, 0, finalWidth, finalHeight);
        }

        // Load and draw SVG
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

            // Download
            const link = document.createElement("a");
            link.download = `converted-${finalWidth}x${finalHeight}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            toast.success("PNG downloaded!");
        };
        img.onerror = () => {
            toast.error("Failed to convert SVG. The SVG might contain external resources.");
        };
        img.src = svgDataUrl;
    };

    return (
        <ToolLayout
            title="SVG to PNG Converter"
            description="Convert SVG files to PNG with custom sizing"
        >
            <div className="space-y-6">
                {/* Input Methods */}
                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload File
                        </TabsTrigger>
                        <TabsTrigger value="paste">
                            <FileCode className="w-4 h-4 mr-2" />
                            Paste Code
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-4">
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".svg,image/svg+xml"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:opacity-90"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload SVG File
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="paste" className="space-y-4">
                        <div>
                            <Label htmlFor="svgCode">SVG Code</Label>
                            <Textarea
                                id="svgCode"
                                value={svgContent}
                                onChange={(e) => setSvgContent(e.target.value)}
                                placeholder="Paste your SVG code here..."
                                className="font-mono text-sm min-h-[200px]"
                            />
                        </div>
                        <Button onClick={handleSvgPaste} className="w-full">
                            Process SVG
                        </Button>
                    </TabsContent>
                </Tabs>

                {svgDataUrl && (
                    <>
                        {/* SVG Preview */}
                        <div>
                            <Label className="mb-2 block">SVG Preview</Label>
                            <div className="border rounded-lg p-4 bg-muted flex justify-center items-center min-h-[200px]">
                                <img
                                    src={svgDataUrl}
                                    alt="SVG Preview"
                                    className="max-w-full h-auto"
                                    style={{ maxHeight: "300px" }}
                                />
                            </div>
                        </div>

                        {/* Size Options */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <input
                                    type="checkbox"
                                    id="useOriginalSize"
                                    checked={useOriginalSize}
                                    onChange={(e) => setUseOriginalSize(e.target.checked)}
                                    className="rounded"
                                />
                                <Label htmlFor="useOriginalSize" className="cursor-pointer">
                                    Use original SVG dimensions
                                </Label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="width">Width (px)</Label>
                                    <Input
                                        id="width"
                                        type="number"
                                        value={width}
                                        onChange={(e) => setWidth(Number(e.target.value))}
                                        disabled={useOriginalSize}
                                        min={1}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="height">Height (px)</Label>
                                    <Input
                                        id="height"
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(Number(e.target.value))}
                                        disabled={useOriginalSize}
                                        min={1}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Scale Options */}
                        {useOriginalSize && (
                            <div>
                                <Label className="mb-2 block">Scale Multiplier</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {SCALE_OPTIONS.map((option) => (
                                        <Button
                                            key={option.value}
                                            variant={scale === option.value ? "default" : "outline"}
                                            onClick={() => setScale(option.value)}
                                        >
                                            {option.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Background Options */}
                        <div>
                            <Label className="mb-2 block">Background</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                                <Button
                                    variant={backgroundColor === "transparent" ? "default" : "outline"}
                                    onClick={() => setBackgroundColor("transparent")}
                                >
                                    Transparent
                                </Button>
                                <Button
                                    variant={backgroundColor === "#ffffff" ? "default" : "outline"}
                                    onClick={() => setBackgroundColor("#ffffff")}
                                >
                                    White
                                </Button>
                                <Button
                                    variant={backgroundColor === "#000000" ? "default" : "outline"}
                                    onClick={() => setBackgroundColor("#000000")}
                                >
                                    Black
                                </Button>
                                <Button
                                    variant={backgroundColor === "custom" ? "default" : "outline"}
                                    onClick={() => setBackgroundColor("custom")}
                                >
                                    Custom
                                </Button>
                            </div>

                            {backgroundColor === "custom" && (
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={customBgColor}
                                        onChange={(e) => setCustomBgColor(e.target.value)}
                                        className="h-10 w-20"
                                    />
                                    <Input
                                        value={customBgColor}
                                        onChange={(e) => setCustomBgColor(e.target.value)}
                                        className="flex-1"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Output Info */}
                        <div className="border rounded-lg p-4 bg-muted">
                            <p className="text-sm">
                                <strong>Output size:</strong>{" "}
                                {useOriginalSize ? width * scale : width} × {useOriginalSize ? height * scale : height} pixels
                            </p>
                        </div>

                        {/* Convert Button */}
                        <Button onClick={convertToPng} className="w-full bg-primary">
                            <Download className="w-4 h-4 mr-2" />
                            Convert & Download PNG
                        </Button>

                        {/* Hidden canvas for conversion */}
                        <canvas ref={canvasRef} className="hidden" />
                    </>
                )}
            </div>
        </ToolLayout>
    );
};

export default SvgToPngConverter;
