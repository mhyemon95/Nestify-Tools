import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Download, Upload, Type, ImageIcon } from "lucide-react";

const POSITIONS = [
    { label: "Top Left", value: "top-left" },
    { label: "Top Right", value: "top-right" },
    { label: "Bottom Left", value: "bottom-left" },
    { label: "Bottom Right", value: "bottom-right" },
    { label: "Center", value: "center" },
];

const WatermarkTool = () => {
    const [baseImage, setBaseImage] = useState<string | null>(null);
    const [watermarkImage, setWatermarkImage] = useState<string | null>(null);
    const [text, setText] = useState("WATERMARK");
    const [fontSize, setFontSize] = useState(48);
    const [textColor, setTextColor] = useState("#ffffff");
    const [opacity, setOpacity] = useState(50);
    const [position, setPosition] = useState("bottom-right");
    const [rotation, setRotation] = useState(0);
    const [watermarkSize, setWatermarkSize] = useState(100);

    const baseImageRef = useRef<HTMLInputElement>(null);
    const watermarkImageRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleBaseImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setBaseImage(reader.result as string);
                toast.success("Base image loaded!");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleWatermarkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setWatermarkImage(reader.result as string);
                toast.success("Watermark image loaded!");
            };
            reader.readAsDataURL(file);
        }
    };

    const getPosition = (canvasWidth: number, canvasHeight: number, watermarkWidth: number, watermarkHeight: number) => {
        const padding = 20;
        switch (position) {
            case "top-left":
                return { x: padding, y: padding };
            case "top-right":
                return { x: canvasWidth - watermarkWidth - padding, y: padding };
            case "bottom-left":
                return { x: padding, y: canvasHeight - watermarkHeight - padding };
            case "bottom-right":
                return { x: canvasWidth - watermarkWidth - padding, y: canvasHeight - watermarkHeight - padding };
            case "center":
                return { x: (canvasWidth - watermarkWidth) / 2, y: (canvasHeight - watermarkHeight) / 2 };
            default:
                return { x: padding, y: padding };
        }
    };

    const applyTextWatermark = async () => {
        if (!baseImage || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        img.src = baseImage;

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Apply watermark
            ctx.save();
            ctx.globalAlpha = opacity / 100;
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.fillStyle = textColor;
            ctx.textBaseline = "top";

            const textMetrics = ctx.measureText(text);
            const textWidth = textMetrics.width;
            const textHeight = fontSize;

            const pos = getPosition(canvas.width, canvas.height, textWidth, textHeight);

            // Apply rotation
            if (rotation !== 0) {
                ctx.translate(pos.x + textWidth / 2, pos.y + textHeight / 2);
                ctx.rotate((rotation * Math.PI) / 180);
                ctx.fillText(text, -textWidth / 2, -textHeight / 2);
            } else {
                ctx.fillText(text, pos.x, pos.y);
            }

            ctx.restore();
            toast.success("Text watermark applied!");
        };
    };

    const applyImageWatermark = async () => {
        if (!baseImage || !watermarkImage || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        const wmImg = new Image();

        img.src = baseImage;
        wmImg.src = watermarkImage;

        await Promise.all([
            new Promise((resolve) => { img.onload = resolve; }),
            new Promise((resolve) => { wmImg.onload = resolve; })
        ]);

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Calculate watermark dimensions
        const wmWidth = (wmImg.width * watermarkSize) / 100;
        const wmHeight = (wmImg.height * watermarkSize) / 100;

        const pos = getPosition(canvas.width, canvas.height, wmWidth, wmHeight);

        ctx.save();
        ctx.globalAlpha = opacity / 100;
        ctx.drawImage(wmImg, pos.x, pos.y, wmWidth, wmHeight);
        ctx.restore();

        toast.success("Image watermark applied!");
    };

    const downloadImage = () => {
        if (!canvasRef.current) {
            toast.error("Please apply a watermark first");
            return;
        }

        const link = document.createElement("a");
        link.download = `watermarked-${Date.now()}.png`;
        link.href = canvasRef.current.toDataURL("image/png");
        link.click();
        toast.success("Image downloaded!");
    };

    return (
        <ToolLayout
            title="Watermark Tool"
            description="Add text or image watermarks to protect your photos"
        >
            <div className="space-y-6">
                {/* Base Image Upload */}
                <div>
                    <Label className="mb-2 block">Base Image</Label>
                    <input
                        ref={baseImageRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBaseImageUpload}
                        className="hidden"
                    />
                    <Button
                        onClick={() => baseImageRef.current?.click()}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Base Image
                    </Button>
                </div>

                {baseImage && (
                    <>
                        {/* Watermark Type Tabs */}
                        <Tabs defaultValue="text" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="text">
                                    <Type className="w-4 h-4 mr-2" />
                                    Text Watermark
                                </TabsTrigger>
                                <TabsTrigger value="image">
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    Image Watermark
                                </TabsTrigger>
                            </TabsList>

                            {/* Text Watermark Tab */}
                            <TabsContent value="text" className="space-y-4">
                                <div>
                                    <Label htmlFor="text">Watermark Text</Label>
                                    <Input
                                        id="text"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Enter watermark text"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="fontSize">Font Size: {fontSize}px</Label>
                                    <input
                                        id="fontSize"
                                        type="range"
                                        min={10}
                                        max={100}
                                        value={fontSize}
                                        onChange={(e) => setFontSize(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="textColor">Text Color</Label>
                                    <div className="flex gap-2">
                                        <input
                                            id="textColor"
                                            type="color"
                                            value={textColor}
                                            onChange={(e) => setTextColor(e.target.value)}
                                            className="h-10 w-20"
                                        />
                                        <Input
                                            value={textColor}
                                            onChange={(e) => setTextColor(e.target.value)}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="rotation">Rotation: {rotation}°</Label>
                                    <input
                                        id="rotation"
                                        type="range"
                                        min={-45}
                                        max={45}
                                        value={rotation}
                                        onChange={(e) => setRotation(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <Button onClick={applyTextWatermark} className="w-full">
                                    Apply Text Watermark
                                </Button>
                            </TabsContent>

                            {/* Image Watermark Tab */}
                            <TabsContent value="image" className="space-y-4">
                                <div>
                                    <input
                                        ref={watermarkImageRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleWatermarkImageUpload}
                                        className="hidden"
                                    />
                                    <Button
                                        onClick={() => watermarkImageRef.current?.click()}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Watermark Image
                                    </Button>
                                </div>

                                {watermarkImage && (
                                    <>
                                        <div>
                                            <Label htmlFor="watermarkSize">Watermark Size: {watermarkSize}%</Label>
                                            <input
                                                id="watermarkSize"
                                                type="range"
                                                min={10}
                                                max={200}
                                                value={watermarkSize}
                                                onChange={(e) => setWatermarkSize(Number(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>

                                        <Button onClick={applyImageWatermark} className="w-full">
                                            Apply Image Watermark
                                        </Button>
                                    </>
                                )}
                            </TabsContent>
                        </Tabs>

                        {/* Common Controls */}
                        <div>
                            <Label htmlFor="opacity">Opacity: {opacity}%</Label>
                            <input
                                id="opacity"
                                type="range"
                                min={0}
                                max={100}
                                value={opacity}
                                onChange={(e) => setOpacity(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <Label className="mb-2 block">Position</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {POSITIONS.map((pos) => (
                                    <Button
                                        key={pos.value}
                                        variant={position === pos.value ? "default" : "outline"}
                                        onClick={() => setPosition(pos.value)}
                                        className="w-full"
                                    >
                                        {pos.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Preview */}
                        <div>
                            <Label className="mb-2 block">Preview</Label>
                            <div className="border rounded-lg p-4 bg-muted">
                                <canvas
                                    ref={canvasRef}
                                    className="max-w-full h-auto mx-auto"
                                    style={{ maxHeight: "400px" }}
                                />
                            </div>
                        </div>

                        {/* Download Button */}
                        <Button onClick={downloadImage} className="w-full bg-primary">
                            <Download className="w-4 h-4 mr-2" />
                            Download Watermarked Image
                        </Button>
                    </>
                )}
            </div>
        </ToolLayout>
    );
};

export default WatermarkTool;
