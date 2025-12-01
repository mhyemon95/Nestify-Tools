import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Download, Upload } from "lucide-react";

const FONTS = [
    "Impact",
    "Arial",
    "Arial Black",
    "Comic Sans MS",
    "Courier New",
    "Georgia",
    "Times New Roman",
    "Verdana",
];

const MemeGenerator = () => {
    const [image, setImage] = useState<string | null>(null);
    const [topText, setTopText] = useState("");
    const [bottomText, setBottomText] = useState("");
    const [fontSize, setFontSize] = useState(48);
    const [fontFamily, setFontFamily] = useState("Impact");
    const [textColor, setTextColor] = useState("#ffffff");
    const [strokeColor, setStrokeColor] = useState("#000000");
    const [strokeWidth, setStrokeWidth] = useState(3);
    const [allCaps, setAllCaps] = useState(true);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result as string);
                toast.success("Image loaded successfully!");
            };
            reader.readAsDataURL(file);
        }
    };

    const drawMeme = () => {
        if (!image || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        img.src = image;

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw image
            ctx.drawImage(img, 0, 0);

            // Configure text
            ctx.font = `bold ${fontSize}px ${fontFamily}`;
            ctx.fillStyle = textColor;
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.textAlign = "center";
            ctx.textBaseline = "top";

            const displayTopText = allCaps ? topText.toUpperCase() : topText;
            const displayBottomText = allCaps ? bottomText.toUpperCase() : bottomText;

            // Draw top text
            if (displayTopText) {
                const topY = 20;
                ctx.strokeText(displayTopText, canvas.width / 2, topY);
                ctx.fillText(displayTopText, canvas.width / 2, topY);
            }

            // Draw bottom text
            if (displayBottomText) {
                const bottomY = canvas.height - fontSize - 20;
                ctx.strokeText(displayBottomText, canvas.width / 2, bottomY);
                ctx.fillText(displayBottomText, canvas.width / 2, bottomY);
            }
        };
    };

    useEffect(() => {
        if (image) {
            drawMeme();
        }
    }, [image, topText, bottomText, fontSize, fontFamily, textColor, strokeColor, strokeWidth, allCaps]);

    const downloadMeme = () => {
        if (!canvasRef.current) {
            toast.error("Please create a meme first");
            return;
        }

        const link = document.createElement("a");
        link.download = `meme-${Date.now()}.png`;
        link.href = canvasRef.current.toDataURL("image/png");
        link.click();
        toast.success("Meme downloaded!");
    };

    return (
        <ToolLayout
            title="Meme Generator"
            description="Create memes with customizable text and styling"
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
                        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Meme Template
                    </Button>
                </div>

                {image && (
                    <>
                        {/* Text Inputs */}
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <Label htmlFor="topText">Top Text</Label>
                                <Input
                                    id="topText"
                                    value={topText}
                                    onChange={(e) => setTopText(e.target.value)}
                                    placeholder="Enter top text"
                                />
                            </div>

                            <div>
                                <Label htmlFor="bottomText">Bottom Text</Label>
                                <Input
                                    id="bottomText"
                                    value={bottomText}
                                    onChange={(e) => setBottomText(e.target.value)}
                                    placeholder="Enter bottom text"
                                />
                            </div>
                        </div>

                        {/* Text Styling */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="fontFamily">Font</Label>
                                <Select value={fontFamily} onValueChange={setFontFamily}>
                                    <SelectTrigger id="fontFamily">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {FONTS.map((font) => (
                                            <SelectItem key={font} value={font}>
                                                {font}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="fontSize">Font Size: {fontSize}px</Label>
                                <input
                                    id="fontSize"
                                    type="range"
                                    min={20}
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
                                <Label htmlFor="strokeColor">Stroke Color</Label>
                                <div className="flex gap-2">
                                    <input
                                        id="strokeColor"
                                        type="color"
                                        value={strokeColor}
                                        onChange={(e) => setStrokeColor(e.target.value)}
                                        className="h-10 w-20"
                                    />
                                    <Input
                                        value={strokeColor}
                                        onChange={(e) => setStrokeColor(e.target.value)}
                                        className="flex-1"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="strokeWidth">Stroke Width: {strokeWidth}px</Label>
                                <input
                                    id="strokeWidth"
                                    type="range"
                                    min={0}
                                    max={10}
                                    value={strokeWidth}
                                    onChange={(e) => setStrokeWidth(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div className="flex items-end">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={allCaps}
                                        onChange={(e) => setAllCaps(e.target.checked)}
                                        className="rounded"
                                    />
                                    <span className="text-sm">ALL CAPS</span>
                                </label>
                            </div>
                        </div>

                        {/* Preview */}
                        <div>
                            <Label className="mb-2 block">Preview</Label>
                            <div className="border rounded-lg p-4 bg-muted flex justify-center">
                                <canvas
                                    ref={canvasRef}
                                    className="max-w-full h-auto rounded"
                                    style={{ maxHeight: "500px" }}
                                />
                            </div>
                        </div>

                        {/* Download Button */}
                        <Button onClick={downloadMeme} className="w-full bg-primary">
                            <Download className="w-4 h-4 mr-2" />
                            Download Meme
                        </Button>
                    </>
                )}
            </div>
        </ToolLayout>
    );
};

export default MemeGenerator;
