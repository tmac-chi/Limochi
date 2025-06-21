import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Lightbulb } from "lucide-react";
import { PhotoGallery } from "@/components/photo-gallery";
import type { Photo } from "@shared/schema";

interface GeneratedContentProps {
  content: {
    sentence: string;
    photos: Photo[];
    keywords: string[];
  };
  onNewGeneration: () => void;
  isGenerating: boolean;
  type: "idea" | "challenge";
}

export function GeneratedContent({ content, onNewGeneration, isGenerating, type }: GeneratedContentProps) {
  const icon = type === "challenge" ? "🎯" : "💡";
  const title = type === "challenge" ? "Challenge Generated!" : "Idea Generated!";
  const buttonText = type === "challenge" ? "New Challenge" : "New Idea";
  
  return (
    <div id="generated-content">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          <Lightbulb className="mr-2 h-4 w-4" />
          {title}
        </div>
      </div>

      <Card className="mb-6 sm:mb-8 shadow-lg">
        <div className="p-4 sm:p-6 lg:p-8 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Your Creative {type === "challenge" ? "Challenge" : "Idea"}
          </h3>
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6 italic px-2">
            "{content.sentence}"
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={onNewGeneration}
              disabled={isGenerating}
              variant="outline"
              className="px-4 sm:px-6"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {buttonText}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="shadow-lg">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Inspiration Photos</h3>
            <Badge variant="secondary" className="text-sm self-start sm:self-auto">
              {content.photos.length} photos
            </Badge>
          </div>
          
          {content.photos.length > 0 ? (
            <PhotoGallery photos={content.photos} />
          ) : (
            <div className="text-center py-12">
              <Lightbulb className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500">No inspiration photos found for this {type}.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}