import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Download, Upload, RotateCcw } from "lucide-react";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop/types";

const ASPECT_RATIOS = [
    { label: "Free", value: undefined },
    { label: "1:1 (Square)", value: 1 },
    { label: "16:9 (Landscape)", value: 16 / 9 },
    { label: "9:16 (Portrait)", value: 9 / 16 },
    { label: "4:3", value: 4 / 3 },
    { label: "3:2", value: 3 / 2 },
];

const ImageCropper = () => {
    const [image, setImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspect, setAspect] = useState<number | undefined>(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createCroppedImage = async () => {
        if (!image || !croppedAreaPixels) return null;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        const img = new Image();
        img.src = image;

        await new Promise((resolve) => {
            img.onload = resolve;
        });

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
            img,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
        );

        return canvas.toDataURL("image/png");
    };

    const downloadCroppedImage = async () => {
        const croppedImage = await createCroppedImage();
        if (!croppedImage) {
            toast.error("Please crop the image first");
            return;
        }

        const link = document.createElement("a");
        link.download = `cropped-image-${Date.now()}.png`;
        link.href = croppedImage;
        link.click();
        toast.success("Image downloaded!");
    };

    const resetImage = () => {
        setImage(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setAspect(1);
        setCroppedAreaPixels(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <ToolLayout
            title="Image Cropper"
            description="Crop images with custom aspect ratios and precision controls"
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
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                    </Button>
                </div>

                {image && (
                    <>
                        {/* Aspect Ratio Selection */}
                        <div>
                            <Label className="mb-2 block">Aspect Ratio</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {ASPECT_RATIOS.map((ratio) => (
                                    <Button
                                        key={ratio.label}
                                        variant={aspect === ratio.value ? "default" : "outline"}
                                        onClick={() => setAspect(ratio.value)}
                                        className="w-full"
                                    >
                                        {ratio.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Zoom Control */}
                        <div>
                            <Label htmlFor="zoom" className="mb-2 block">
                                Zoom: {zoom.toFixed(1)}x
                            </Label>
                            <input
                                id="zoom"
                                type="range"
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        {/* Cropper */}
                        <div className="relative h-[400px] bg-muted rounded-lg overflow-hidden">
                            <Cropper
                                image={image}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspect}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button
                                onClick={downloadCroppedImage}
                                className="flex-1 bg-primary"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Cropped Image
                            </Button>
                            <Button onClick={resetImage} variant="outline">
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reset
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </ToolLayout>
    );
};

export default ImageCropper;
