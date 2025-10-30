import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, Square, Copy, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";

const BarcodeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerElementId = "qr-reader";

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = () => {
    try {
      setError(null);
      setScannedData(null);
      setIsScanning(true);

      const config = {
        fps: 10,
        qrbox: 250,
        aspectRatio: 1.0,
        disableFlip: false
      };

      scannerRef.current = new Html5QrcodeScanner(
        scannerElementId,
        config,
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          setScannedData(decodedText);
          stopScanning();
        },
        (errorMessage) => {
          // Scanning errors are normal, ignore them
        }
      );
    } catch (err) {
      setError('Failed to start scanner. Please ensure camera permissions are granted.');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {});
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const copyToClipboard = async () => {
    if (scannedData) {
      await navigator.clipboard.writeText(scannedData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Link>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl mb-4">
              <Camera className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Barcode Scanner
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Scan QR codes, barcodes, and more using your camera
            </p>
          </div>

          <Card className="p-6">
            <div className="space-y-6">
              <div className="relative">
                <div id={scannerElementId} className="w-full" />
                {!isScanning && !scannedData && (
                  <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Click "Start Scanning" to begin</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-4">
                {!isScanning ? (
                  <Button onClick={startScanning} className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Start Scanning
                  </Button>
                ) : (
                  <Button onClick={stopScanning} variant="destructive" className="flex items-center gap-2">
                    <Square className="w-4 h-4" />
                    Stop Scanning
                  </Button>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {scannedData && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <strong>Scanned Result:</strong>
                        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm break-all">
                          {scannedData}
                        </div>
                      </div>
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        size="sm"
                        className="ml-4 flex items-center gap-2"
                      >
                        {copied ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Supported formats:</strong> QR Code, Code 128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E, and more.
                  Make sure to allow camera access when prompted.
                </AlertDescription>
              </Alert>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
