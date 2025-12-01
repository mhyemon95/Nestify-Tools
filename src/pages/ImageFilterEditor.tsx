import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Download, Upload, RotateCcw, Eye, EyeOff } from "lucide-react";

interface Filters {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    grayscale: number;
    sepia: number;
    hueRotate: number;
    invert: number;
}

const PRESET_FILTERS = {
    none: { brightness: 0, contrast: 0, saturation: 0, blur: 0, grayscale: 0, sepia: 0, hueRotate: 0, invert: 0 },
    vintage: { brightness: 10, contrast: -10, saturation: -20, blur: 0, grayscale: 0, sepia: 40, hueRotate: 0, invert: 0 },
    bw: { brightness: 0, contrast: 10, saturation: 0, blur: 0, grayscale: 100, sepia: 0, hueRotate: 0, invert: 0 },
    vivid: { brightness: 10, contrast: 20, saturation: 30, blur: 0, grayscale: 0, sepia: 0, hueRotate: 0, invert: 0 },
    cool: { brightness: 0, contrast: 0, saturation: 10, blur: 0, grayscale: 0, sepia: 0, hueRotate: 180, invert: 0 },
    warm: { brightness: 10, contrast: 0, saturation: 10, blur: 0, grayscale: 0, sepia: 20, hueRotate: 20, invert: 0 },
};

const ImageFilterEditor = () => {
    const [image, setImage] = useState<string | null>(null);
    const [filters, setFilters] = useState<Filters>(PRESET_FILTERS.none);
    const [showComparison, setShowComparison] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const previewRef = useRef<HTMLImageElement>(null);

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

    const updateFilter = (key: keyof Filters, value: number) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyPreset = (preset: keyof typeof PRESET_FILTERS) => {
        setFilters(PRESET_FILTERS[preset]);
        toast.success(`${preset.charAt(0).toUpperCase() + preset.slice(1)} filter applied!`);
    };

    const resetFilters = () => {
        setFilters(PRESET_FILTERS.none);
        toast.success("Filters reset!");
    };

    const getFilterString = () => {
        return `
      brightness(${100 + filters.brightness}%)
      contrast(${100 + filters.contrast}%)
      saturate(${100 + filters.saturation}%)
      blur(${filters.blur}px)
      grayscale(${filters.grayscale}%)
      sepia(${filters.sepia}%)
      hue-rotate(${filters.hueRotate}deg)
      invert(${filters.invert}%)
    `.trim();
    };

    useEffect(() => {
        if (previewRef.current) {
            previewRef.current.style.filter = getFilterString();
        }
    }, [filters]);

    const downloadImage = () => {
        if (!image || !canvasRef.current) {
            toast.error("Please upload an image first");
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        img.src = image;

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            // Apply filters to canvas
            ctx.filter = getFilterString();
            ctx.drawImage(img, 0, 0);

            const link = document.createElement("a");
            link.download = `filtered-image-${Date.now()}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            toast.success("Image downloaded!");
        };
    };

    return (
        <ToolLayout
            title="Image Filter Editor"
            description="Apply professional filters and adjustments to images"
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
                        className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:opacity-90"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                    </Button>
                </div>

                {image && (
                    <>
                        {/* Preset Filters */}
                        <div>
                            <Label className="mb-2 block">Preset Filters</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {Object.keys(PRESET_FILTERS).map((preset) => (
                                    <Button
                                        key={preset}
                                        variant="outline"
                                        onClick={() => applyPreset(preset as keyof typeof PRESET_FILTERS)}
                                        className="capitalize"
                                    >
                                        {preset === "bw" ? "B&W" : preset}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Filter Controls */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="brightness">Brightness: {filters.brightness}</Label>
                                <input
                                    id="brightness"
                                    type="range"
                                    min={-100}
                                    max={100}
                                    value={filters.brightness}
                                    onChange={(e) => updateFilter("brightness", Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label htmlFor="contrast">Contrast: {filters.contrast}</Label>
                                <input
                                    id="contrast"
                                    type="range"
                                    min={-100}
                                    max={100}
                                    value={filters.contrast}
                                    onChange={(e) => updateFilter("contrast", Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label htmlFor="saturation">Saturation: {filters.saturation}</Label>
                                <input
                                    id="saturation"
                                    type="range"
                                    min={-100}
                                    max={100}
                                    value={filters.saturation}
                                    onChange={(e) => updateFilter("saturation", Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label htmlFor="blur">Blur: {filters.blur}px</Label>
                                <input
                                    id="blur"
                                    type="range"
                                    min={0}
                                    max={20}
                                    value={filters.blur}
                                    onChange={(e) => updateFilter("blur", Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label htmlFor="grayscale">Grayscale: {filters.grayscale}%</Label>
                                <input
                                    id="grayscale"
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={filters.grayscale}
                                    onChange={(e) => updateFilter("grayscale", Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label htmlFor="sepia">Sepia: {filters.sepia}%</Label>
                                <input
                                    id="sepia"
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={filters.sepia}
                                    onChange={(e) => updateFilter("sepia", Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label htmlFor="hueRotate">Hue Rotate: {filters.hueRotate}°</Label>
                                <input
                                    id="hueRotate"
                                    type="range"
                                    min={0}
                                    max={360}
                                    value={filters.hueRotate}
                                    onChange={(e) => updateFilter("hueRotate", Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <Label htmlFor="invert">Invert: {filters.invert}%</Label>
                                <input
                                    id="invert"
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={filters.invert}
                                    onChange={(e) => updateFilter("invert", Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Preview */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Label>Preview</Label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowComparison(!showComparison)}
                                >
                                    {showComparison ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                    {showComparison ? "Hide" : "Show"} Original
                                </Button>
                            </div>
                            <div className={`grid ${showComparison ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
                                {showComparison && (
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-2">Original</p>
                                        <img src={image} alt="Original" className="w-full rounded-lg border" />
                                    </div>
                                )}
                                <div>
                                    {showComparison && <p className="text-sm text-muted-foreground mb-2">Filtered</p>}
                                    <img
                                        ref={previewRef}
                                        src={image}
                                        alt="Filtered"
                                        className="w-full rounded-lg border"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button onClick={downloadImage} className="flex-1 bg-primary">
                                <Download className="w-4 h-4 mr-2" />
                                Download Filtered Image
                            </Button>
                            <Button onClick={resetFilters} variant="outline">
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reset
                            </Button>
                        </div>

                        {/* Hidden canvas for export */}
                        <canvas ref={canvasRef} className="hidden" />
                    </>
                )}
            </div>
        </ToolLayout>
    );
};

export default ImageFilterEditor;
