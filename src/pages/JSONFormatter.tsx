import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { CheckCircle, XCircle, Copy } from "lucide-react";

const JSONFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setIsValid(true);
      setError("");
      toast.success("JSON is valid and formatted!");
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setOutput("");
      toast.error("Invalid JSON");
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsValid(true);
      setError("");
      toast.success("JSON minified!");
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : "Invalid JSON");
      setOutput("");
      toast.error("Invalid JSON");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setIsValid(null);
    setError("");
  };

  return (
    <ToolLayout
      title="JSON Formatter & Validator"
      description="Beautify, minify, and validate JSON data"
    >
      <div className="space-y-4">
        <div className="flex gap-3 flex-wrap">
          <Button onClick={formatJSON} className="bg-primary">
            Format JSON
          </Button>
          <Button onClick={minifyJSON} variant="outline">
            Minify JSON
          </Button>
          <Button onClick={clearAll} variant="outline">
            Clear
          </Button>
          {output && (
            <Button onClick={copyToClipboard} variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Copy Output
            </Button>
          )}
        </div>

        {isValid !== null && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${isValid ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'}`}>
            {isValid ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Valid JSON</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5" />
                <span>Invalid JSON: {error}</span>
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Input</h3>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"name": "John", "age": 30}'
              className="font-mono text-sm h-96"
            />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Output</h3>
            <Textarea
              value={output}
              readOnly
              placeholder="Formatted JSON will appear here..."
              className="font-mono text-sm h-96 bg-muted"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default JSONFormatter;
