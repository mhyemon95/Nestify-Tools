import { ToolLayout } from "@/components/ToolLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const TextSummarizer = () => {
  return (
    <ToolLayout
      title="Text Summarizer"
      description="Summarize long articles or documents"
    >
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          AI-powered text summarization requires Lovable Cloud integration.
          This feature will use advanced language models to create concise summaries of your documents.
        </AlertDescription>
      </Alert>
    </ToolLayout>
  );
};

export default TextSummarizer;
