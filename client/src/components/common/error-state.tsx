import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry: () => void;
  retryLabel?: string;
}

export function ErrorState({ title, description, onRetry, retryLabel = "Try Again" }: ErrorStateProps) {
  return (
    <section className="text-center py-12 sm:py-16">
      <div className="max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="text-red-500 text-xl" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-6">{description}</p>
        <Button onClick={onRetry} className="bg-primary hover:bg-primary/90">
          {retryLabel}
        </Button>
      </div>
    </section>
  );
}