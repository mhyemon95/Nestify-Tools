import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Copy, ExternalLink } from "lucide-react";
import exifr from "exifr";

interface FileMetadata {
    name: string;
    size: string;
    type: string;
    dimensions: string;
    lastModified: string;
}

interface ExifData {
    [key: string]: any;
}

const ImageMetadataViewer = () => {
    const [image, setImage] = useState<string | null>(null);
    const [fileMetadata, setFileMetadata] = useState<FileMetadata | null>(null);
    const [exifData, setExifData] = useState<ExifData | null>(null);
    const [hasExif, setHasExif] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async () => {
            setImage(reader.result as string);

            // Get basic file metadata
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
                setFileMetadata({
                    name: file.name,
                    size: formatFileSize(file.size),
                    type: file.type,
                    dimensions: `${img.width} × ${img.height} pixels`,
                    lastModified: new Date(file.lastModified).toLocaleString(),
                });
            };

            // Extract EXIF data
            try {
                const exif = await exifr.parse(file, {
                    tiff: true,
                    exif: true,
                    gps: true,
                    ifd0: true,
                    ifd1: true
                });

                if (exif && Object.keys(exif).length > 0) {
                    setExifData(exif);
                    setHasExif(true);
                    toast.success("Image loaded with EXIF data!");
                } else {
                    setExifData(null);
                    setHasExif(false);
                    toast.info("Image loaded (no EXIF data found)");
                }
            } catch (error) {
                setExifData(null);
                setHasExif(false);
                toast.info("Image loaded (no EXIF data available)");
            }
        };
        reader.readAsDataURL(file);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const copyAllData = () => {
        const allData = {
            fileMetadata,
            exifData,
        };
        navigator.clipboard.writeText(JSON.stringify(allData, null, 2));
        toast.success("All metadata copied as JSON!");
    };

    const formatValue = (value: any): string => {
        if (value === null || value === undefined) return "N/A";
        if (typeof value === "object") return JSON.stringify(value);
        if (typeof value === "number") return value.toFixed(2);
        return String(value);
    };

    const getGoogleMapsLink = () => {
        if (!exifData?.latitude || !exifData?.longitude) return null;
        return `https://www.google.com/maps?q=${exifData.latitude},${exifData.longitude}`;
    };

    return (
        <ToolLayout
            title="Image Metadata Viewer"
            description="View EXIF data and detailed image information"
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
                        className="w-full bg-gradient-to-r from-slate-500 to-gray-500 hover:opacity-90"
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                    </Button>
                </div>

                {image && fileMetadata && (
                    <>
                        {/* Image Preview */}
                        <div>
                            <Label className="mb-2 block">Image Preview</Label>
                            <div className="border rounded-lg p-4 bg-muted flex justify-center">
                                <img
                                    src={image}
                                    alt="Preview"
                                    className="max-w-full h-auto rounded"
                                    style={{ maxHeight: "300px" }}
                                />
                            </div>
                        </div>

                        {/* Copy All Button */}
                        <Button onClick={copyAllData} variant="outline" className="w-full">
                            <Copy className="w-4 h-4 mr-2" />
                            Copy All Metadata as JSON
                        </Button>

                        {/* File Information */}
                        <div className="border rounded-lg p-4 space-y-3">
                            <h3 className="font-semibold text-lg mb-3">File Information</h3>
                            {Object.entries(fileMetadata).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                    <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">{value}</span>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => copyToClipboard(value)}
                                            className="h-6 w-6 p-0"
                                        >
                                            <Copy className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* EXIF Data */}
                        {hasExif && exifData ? (
                            <div className="border rounded-lg p-4 space-y-3">
                                <h3 className="font-semibold text-lg mb-3">EXIF Data</h3>

                                {/* Camera Information */}
                                {(exifData.Make || exifData.Model) && (
                                    <div className="mb-4">
                                        <h4 className="font-medium text-sm mb-2 text-primary">Camera</h4>
                                        {exifData.Make && (
                                            <div className="flex justify-between items-center py-1">
                                                <span className="text-sm">Make</span>
                                                <span className="text-sm text-muted-foreground">{exifData.Make}</span>
                                            </div>
                                        )}
                                        {exifData.Model && (
                                            <div className="flex justify-between items-center py-1">
                                                <span className="text-sm">Model</span>
                                                <span className="text-sm text-muted-foreground">{exifData.Model}</span>
                                            </div>
                                        )}
                                        {exifData.LensModel && (
                                            <div className="flex justify-between items-center py-1">
                                                <span className="text-sm">Lens</span>
                                                <span className="text-sm text-muted-foreground">{exifData.LensModel}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Exposure Settings */}
                                {(exifData.ISO || exifData.FNumber || exifData.ExposureTime || exifData.FocalLength) && (
                                    <div className="mb-4">
                                        <h4 className="font-medium text-sm mb-2 text-primary">Exposure</h4>
                                        {exifData.ISO && (
                                            <div className="flex justify-between items-center py-1">
                                                <span className="text-sm">ISO</span>
                                                <span className="text-sm text-muted-foreground">{exifData.ISO}</span>
                                            </div>
                                        )}
                                        {exifData.FNumber && (
                                            <div className="flex justify-between items-center py-1">
                                                <span className="text-sm">Aperture</span>
                                                <span className="text-sm text-muted-foreground">f/{exifData.FNumber}</span>
                                            </div>
                                        )}
                                        {exifData.ExposureTime && (
                                            <div className="flex justify-between items-center py-1">
                                                <span className="text-sm">Shutter Speed</span>
                                                <span className="text-sm text-muted-foreground">
                                                    {exifData.ExposureTime < 1 ? `1/${Math.round(1 / exifData.ExposureTime)}` : exifData.ExposureTime}s
                                                </span>
                                            </div>
                                        )}
                                        {exifData.FocalLength && (
                                            <div className="flex justify-between items-center py-1">
                                                <span className="text-sm">Focal Length</span>
                                                <span className="text-sm text-muted-foreground">{exifData.FocalLength}mm</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* GPS Location */}
                                {(exifData.latitude && exifData.longitude) && (
                                    <div className="mb-4">
                                        <h4 className="font-medium text-sm mb-2 text-primary">Location</h4>
                                        <div className="flex justify-between items-center py-1">
                                            <span className="text-sm">Coordinates</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground">
                                                    {exifData.latitude.toFixed(6)}, {exifData.longitude.toFixed(6)}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => window.open(getGoogleMapsLink()!, "_blank")}
                                                    className="h-6 w-6 p-0"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Date/Time */}
                                {(exifData.DateTimeOriginal || exifData.CreateDate) && (
                                    <div className="mb-4">
                                        <h4 className="font-medium text-sm mb-2 text-primary">Date & Time</h4>
                                        <div className="flex justify-between items-center py-1">
                                            <span className="text-sm">Taken</span>
                                            <span className="text-sm text-muted-foreground">
                                                {formatValue(exifData.DateTimeOriginal || exifData.CreateDate)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* All Other EXIF Data */}
                                <div>
                                    <h4 className="font-medium text-sm mb-2 text-primary">All EXIF Fields</h4>
                                    <div className="max-h-64 overflow-y-auto space-y-1">
                                        {Object.entries(exifData)
                                            .sort(([a], [b]) => a.localeCompare(b))
                                            .map(([key, value]) => (
                                                <div key={key} className="flex justify-between items-center py-1 text-xs">
                                                    <span className="font-mono">{key}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-muted-foreground truncate max-w-xs">
                                                            {formatValue(value)}
                                                        </span>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => copyToClipboard(formatValue(value))}
                                                            className="h-5 w-5 p-0"
                                                        >
                                                            <Copy className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="border rounded-lg p-6 text-center bg-muted">
                                <p className="text-muted-foreground">
                                    No EXIF data found in this image. This is common for screenshots, edited images, or images from sources that strip metadata.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </ToolLayout>
    );
};

export default ImageMetadataViewer;
