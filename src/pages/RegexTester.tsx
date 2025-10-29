import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const RegexTester = () => {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState<RegExpMatchArray | null>(null);
  const [error, setError] = useState("");

  const testRegex = () => {
    try {
      const regex = new RegExp(pattern, flags);
      const result = testString.match(regex);
      setMatches(result);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid regex pattern");
      setMatches(null);
    }
  };

  const highlightMatches = () => {
    if (!matches || matches.length === 0) return testString;

    let highlighted = testString;
    const regex = new RegExp(pattern, flags);
    highlighted = highlighted.replace(regex, (match) => `<mark class="bg-yellow-300 dark:bg-yellow-600">${match}</mark>`);
    return highlighted;
  };

  return (
    <ToolLayout
      title="Regex Tester"
      description="Test and debug regular expressions in real-time"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="pattern">Regular Expression Pattern</Label>
            <Input
              id="pattern"
              value={pattern}
              onChange={(e) => {
                setPattern(e.target.value);
                testRegex();
              }}
              placeholder="e.g., \d{3}-\d{3}-\d{4}"
              className="font-mono"
            />
          </div>

          <div>
            <Label htmlFor="flags">Flags</Label>
            <div className="flex gap-2">
              <Input
                id="flags"
                value={flags}
                onChange={(e) => {
                  setFlags(e.target.value);
                  testRegex();
                }}
                placeholder="g, i, m, etc."
                className="font-mono"
              />
              <div className="flex gap-2 items-center">
                {['g', 'i', 'm', 's', 'u', 'y'].map((flag) => (
                  <Badge
                    key={flag}
                    variant={flags.includes(flag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (flags.includes(flag)) {
                        setFlags(flags.replace(flag, ''));
                      } else {
                        setFlags(flags + flag);
                      }
                      testRegex();
                    }}
                  >
                    {flag}
                  </Badge>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              g: global, i: case insensitive, m: multiline, s: dotAll, u: unicode, y: sticky
            </p>
          </div>

          <div>
            <Label htmlFor="testString">Test String</Label>
            <Textarea
              id="testString"
              value={testString}
              onChange={(e) => {
                setTestString(e.target.value);
                testRegex();
              }}
              placeholder="Enter text to test against the pattern..."
              rows={6}
              className="font-mono"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
            Error: {error}
          </div>
        )}

        {matches && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Matches Found: {matches.length}</h3>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div
                className="whitespace-pre-wrap font-mono text-sm"
                dangerouslySetInnerHTML={{ __html: highlightMatches() }}
              />
            </div>
            {matches.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">Match Details:</h4>
                {matches.map((match, index) => (
                  <div key={index} className="p-2 bg-muted rounded text-sm font-mono">
                    Match {index + 1}: <span className="text-primary">{match}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default RegexTester;
