import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: string;
  extension: string;
}

const FileMetadata = () => {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const extension = file.name.split('.').pop() || '';
      setFileInfo({
        name: file.name,
        size: file.size,
        type: file.type || 'Unknown',
        lastModified: new Date(file.lastModified).toLocaleString(),
        extension: extension.toUpperCase(),
      });
      toast.success("File loaded successfully!");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <ToolLayout
      title="File Metadata Viewer"
      description="Inspect file properties and details"
    >
      <div className="space-y-6">
        <div className="text-center">
          <input
            type="file"
            id="file-upload"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label htmlFor="file-upload">
            <Button asChild className="bg-gradient-to-r from-primary to-accent cursor-pointer">
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Select File
              </span>
            </Button>
          </label>
        </div>

        {fileInfo && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">File Name</div>
                <div className="font-semibold break-all">{fileInfo.name}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">File Type</div>
                <div className="font-semibold">{fileInfo.type}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">File Size</div>
                <div className="font-semibold">{formatSize(fileInfo.size)}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Extension</div>
                <div className="font-semibold">{fileInfo.extension}</div>
              </div>
              <div className="p-4 bg-muted rounded-lg md:col-span-2">
                <div className="text-sm text-muted-foreground mb-1">Last Modified</div>
                <div className="font-semibold">{fileInfo.lastModified}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default FileMetadata;
