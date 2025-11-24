import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Upload, FileJson, Download, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const CsvViewer = () => {
    const [csvData, setCsvData] = useState<string[][]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [rawInput, setRawInput] = useState("");
    const [fileName, setFileName] = useState("");

    const parseCSV = (text: string) => {
        const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== "");
        if (lines.length === 0) {
            setHeaders([]);
            setCsvData([]);
            return;
        }

        // Simple CSV parser (handles basic comma separation)
        // For production, a robust library like PapaParse is recommended
        const parseLine = (line: string) => {
            const result = [];
            let current = "";
            let inQuotes = false;

            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    result.push(current.trim());
                    current = "";
                } else {
                    current += char;
                }
            }
            result.push(current.trim());
            return result;
        };

        const parsedData = lines.map(parseLine);
        setHeaders(parsedData[0]);
        setCsvData(parsedData.slice(1));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            setRawInput(text);
            parseCSV(text);
            toast.success("CSV loaded successfully");
        };
        reader.readAsText(file);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRawInput(e.target.value);
        parseCSV(e.target.value);
    };

    const downloadJson = () => {
        if (headers.length === 0) return;

        const jsonData = csvData.map(row => {
            const obj: Record<string, string> = {};
            headers.forEach((header, index) => {
                obj[header] = row[index] || "";
            });
            return obj;
        });

        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName ? fileName.replace(".csv", ".json") : "data.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("JSON downloaded successfully");
    };

    const clearAll = () => {
        setRawInput("");
        setCsvData([]);
        setHeaders([]);
        setFileName("");
        toast.info("Cleared all data");
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Tools
                    </Link>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            CSV Viewer & Converter
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            View CSV files and convert them to JSON
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="p-6">
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="csv-upload"
                                        />
                                        <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
                                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                                {fileName || "Upload CSV File"}
                                            </span>
                                        </label>
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
                                                Or paste content
                                            </span>
                                        </div>
                                    </div>

                                    <Textarea
                                        placeholder="Paste CSV content here..."
                                        value={rawInput}
                                        onChange={handleTextChange}
                                        className="min-h-[200px] font-mono text-xs"
                                    />

                                    <div className="flex gap-2">
                                        <Button
                                            onClick={downloadJson}
                                            className="flex-1"
                                            disabled={headers.length === 0}
                                        >
                                            <FileJson className="w-4 h-4 mr-2" />
                                            Export JSON
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={clearAll}
                                            disabled={!rawInput}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <div className="lg:col-span-2">
                            <Card className="p-6 h-full min-h-[500px] flex flex-col">
                                {headers.length > 0 ? (
                                    <div className="overflow-auto flex-1">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    {headers.map((header, i) => (
                                                        <TableHead key={i} className="whitespace-nowrap">
                                                            {header}
                                                        </TableHead>
                                                    ))}
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {csvData.map((row, rowIndex) => (
                                                    <TableRow key={rowIndex}>
                                                        {row.map((cell, cellIndex) => (
                                                            <TableCell key={cellIndex} className="whitespace-nowrap">
                                                                {cell}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                        <FileJson className="w-16 h-16 mb-4 opacity-20" />
                                        <p>Upload or paste CSV data to view</p>
                                    </div>
                                )}
                                {headers.length > 0 && (
                                    <div className="mt-4 text-sm text-gray-500 text-right">
                                        {csvData.length} rows • {headers.length} columns
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CsvViewer;
