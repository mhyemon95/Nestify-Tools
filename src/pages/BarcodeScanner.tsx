import { ToolLayout } from "@/components/ToolLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const BarcodeScanner = () => {
  return (
    <ToolLayout
      title="Barcode Scanner"
      description="Scan and decode barcodes via webcam"
    >
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This feature requires webcam access and specialized barcode scanning libraries.
          Full implementation coming soon with support for QR codes, UPC, EAN, and more formats.
        </AlertDescription>
      </Alert>
    </ToolLayout>
  );
};

export default BarcodeScanner;
