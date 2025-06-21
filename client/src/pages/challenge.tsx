
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Sparkles, Target, Image } from "lucide-react";
import { Header } from "@/components/layout/header";
import { GeneratedContent } from "@/components/common/generated-content";
import { LoadingState } from "@/components/common/loading-state";
import { ErrorState } from "@/components/common/error-state";
import type { Photo } from "@shared/schema";

interface ChallengeFilters {
  level: string;
}

interface ChallengeContent {
  sentence: string;
  photos: Photo[];
  keywords: string[];
}

const levelOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

// Tool options (matching server's logic)


export default function Challenge() {
  const [selectedFilters, setSelectedFilters] = useState<ChallengeFilters>({
    level: ""
  });
  const [generatedContent, setGeneratedContent] = useState<ChallengeContent | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const generateChallengeMutation = useMutation({
    mutationFn: async (filters: ChallengeFilters) => {
      // Generate challenge based on skill level
      const response = await apiRequest("POST", "/api/generate-challenge", { 
        level: filters.level 
      });
      return response.json();
    },
    onSuccess: (data: ChallengeContent) => {
      setGeneratedContent(data);
      setTimeout(() => {
        document.getElementById("generated-content")?.scrollIntoView({ 
          behavior: "smooth", 
          block: "start" 
        });
      }, 100);
    },
  });

  const loadMorePhotosMutation = useMutation({
    mutationFn: async () => {
      if (!generatedContent) return { photos: [] };
      
      const response = await apiRequest("POST", "/api/load-more-photos", { 
        keywords: generatedContent.keywords 
      });
      return response.json();
    },
    onSuccess: (data: { photos: Photo[] }) => {
      if (generatedContent) {
        setGeneratedContent({
          ...generatedContent,
          photos: [...generatedContent.photos, ...data.photos]
        });
      }
    },
  });

  const handleFilterChange = (value: string) => {
    setSelectedFilters({ level: value });
  };

  const hasSelectedFilters = () => {
    return selectedFilters.level.length > 0;
  };

  const handleStartChallenge = () => {
    if (!hasSelectedFilters()) return;
    generateChallengeMutation.mutate(selectedFilters);
  };

  const handleNewChallenge = () => {
    generateChallengeMutation.mutate(selectedFilters);
  };

  const handleLoadMore = () => {
    if (generatedContent) {
      setIsLoadingMore(true);
      loadMorePhotosMutation.mutate();
      setTimeout(() => setIsLoadingMore(false), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentPage="challenge" 
        icon={<Target className="text-white text-lg" />}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Take on an Art Challenge
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Choose your skill level and receive a complete creative challenge with random elements to push your boundaries
          </p>
        </div>

        {/* Filter Section */}
        <section className="mb-6 sm:mb-8">
          <Card className="shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6">
              <div className="max-w-md mx-auto">
                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Skill Level <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={selectedFilters.level}
                    onValueChange={handleFilterChange}
                  >
                    <SelectTrigger className="w-full h-12">
                      <SelectValue placeholder="Select your skill level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levelOptions.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Selected Level</h3>
                    <div className="flex flex-wrap gap-2 min-h-[2rem]">
                      {selectedFilters.level ? (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          <Target className="mr-1 h-3 w-3" />
                          {levelOptions.find(opt => opt.value === selectedFilters.level)?.label}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-gray-600">
                          No level selected
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={handleStartChallenge}
                    disabled={!hasSelectedFilters() || generateChallengeMutation.isPending}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-6 sm:px-8 py-3 font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none w-full sm:w-auto"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {generateChallengeMutation.isPending ? "Generating..." : "Start Challenge"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Challenge Description */}
        {selectedFilters.level && !generateChallengeMutation.isPending && !generatedContent && (
          <section className="mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="p-6 text-center">
                <Target className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {levelOptions.find(opt => opt.value === selectedFilters.level)?.label} Challenge Ready!
                </h3>
                <p className="text-gray-600">
                  {selectedFilters.level === "beginner" && "Get a simple creative prompt with one subject and a random tool."}
                  {selectedFilters.level === "intermediate" && "Receive a challenge combining two subjects with a specific tool."}
                  {selectedFilters.level === "advanced" && "Take on a complex challenge with three subjects, a tool, and artistic style."}
                </p>
              </div>
            </Card>
          </section>
        )}

        {/* Loading State */}
        {generateChallengeMutation.isPending && (
          <LoadingState 
            title="Preparing your challenge..."
            description="Selecting random elements and finding perfect reference photos..."
          />
        )}

        {/* Error State */}
        {generateChallengeMutation.isError && (
          <ErrorState
            title="Something went wrong"
            description={generateChallengeMutation.error?.message || "We couldn't generate your challenge. Please try again."}
            onRetry={handleStartChallenge}
            retryLabel="Try Again"
          />
        )}

        {/* Generated Content */}
        {generatedContent && !generateChallengeMutation.isPending && (
          <>
            <GeneratedContent 
              content={generatedContent}
              onNewGeneration={handleNewChallenge}
              isGenerating={generateChallengeMutation.isPending}
              type="challenge"
            />
            {generatedContent.photos.length > 0 && (
              <div className="mt-8 text-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={loadMorePhotosMutation.isPending || isLoadingMore}
                  variant="outline"
                  className="px-8"
                >
                  {(loadMorePhotosMutation.isPending || isLoadingMore) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Image className="mr-2 h-4 w-4" />
                      Load More Photos
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
