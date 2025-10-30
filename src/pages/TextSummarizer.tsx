import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Copy, CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TextSummarizer = () => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryLength, setSummaryLength] = useState("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const summarizeText = () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    
    // Simple extractive summarization
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    if (sentences.length <= 2) {
      setSummary(inputText);
      setIsLoading(false);
      return;
    }
    
    // Score sentences based on word frequency
    const words = inputText.toLowerCase().match(/\b\w+\b/g) || [];
    const wordFreq: { [key: string]: number } = {};
    
    words.forEach(word => {
      if (word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
    
    const sentenceScores = sentences.map(sentence => {
      const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
      const score = sentenceWords.reduce((sum, word) => sum + (wordFreq[word] || 0), 0);
      return { sentence: sentence.trim(), score };
    });
    
    // Sort by score and select top sentences
    sentenceScores.sort((a, b) => b.score - a.score);
    
    let numSentences;
    switch (summaryLength) {
      case "short":
        numSentences = Math.max(1, Math.floor(sentences.length * 0.2));
        break;
      case "long":
        numSentences = Math.max(2, Math.floor(sentences.length * 0.5));
        break;
      default:
        numSentences = Math.max(1, Math.floor(sentences.length * 0.3));
    }
    
    const topSentences = sentenceScores.slice(0, numSentences);
    
    // Reorder sentences to maintain original order
    const orderedSummary = sentences
      .filter(sentence => topSentences.some(ts => ts.sentence === sentence.trim()))
      .join(". ") + ".";
    
    setTimeout(() => {
      setSummary(orderedSummary);
      setIsLoading(false);
    }, 1000);
  };

  const copyToClipboard = async () => {
    if (summary) {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Link>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-2xl mb-4">
              <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Text Summarizer
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Create concise summaries of long texts and articles
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Input Text</h2>
              <Textarea
                placeholder="Paste your text here to summarize..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[300px] mb-4"
              />
              <div className="flex gap-4 items-center">
                <Select value={summaryLength} onValueChange={setSummaryLength}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={summarizeText} 
                  disabled={!inputText.trim() || isLoading}
                  className="flex-1"
                >
                  {isLoading ? "Summarizing..." : "Summarize Text"}
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Summary</h2>
                {summary && (
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                )}
              </div>
              <div className="min-h-[300px] p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {summary ? (
                  <p className="text-gray-900 dark:text-gray-100 leading-relaxed">
                    {summary}
                  </p>
                ) : (
                  <p className="text-gray-500 italic">
                    Your summary will appear here...
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextSummarizer;
