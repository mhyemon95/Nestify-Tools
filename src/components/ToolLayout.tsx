import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export const ToolLayout = ({ title, description, children }: ToolLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6 hover:bg-primary/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-muted-foreground text-lg">{description}</p>
        </div>

        <div className="bg-card rounded-xl border-2 shadow-[var(--shadow-card)] p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
