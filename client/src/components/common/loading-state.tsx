import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  title: string;
  description: string;
}

export function LoadingState({ title, description }: LoadingStateProps) {
  return (
    <section className="text-center py-12 sm:py-16">
      <div className="max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-6">
          <Loader2 className="text-white text-xl animate-spin" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-6">{description}</p>
        <div className="w-48 sm:w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full animate-pulse w-3/5"></div>
        </div>
      </div>
    </section>
  );
}