import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { Sparkles, Lightbulb, WandSparkles, Loader2, Image } from "lucide-react";
import { Header } from "@/components/layout/header";
import { GeneratedContent } from "@/components/common/generated-content";
import { LoadingState } from "@/components/common/loading-state";
import { ErrorState } from "@/components/common/error-state";
import type { Photo } from "@shared/schema";

interface IdeaFilters {
  level: string;
  category: string[];
  mood: string;
  randomMood: boolean;
}

interface GeneratedContentType {
  sentence: string;
  photos: Photo[];
  keywords: string[];
}



const levelOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const categoryOptions = [
  { value: "nature", label: "Nature" },
  { value: "fantasy", label: "Fantasy" },
  { value: "objects", label: "Objects" },
  { value: "food", label: "Food" },
  { value: "worlds", label: "Worlds" },
  { value: "architecture", label: "Architecture" },
  { value: "character", label: "Character" },
  { value: "abstract", label: "Abstract" },
];

const moodOptions = [
  { value: "soft", label: "Soft" },
  { value: "dark", label: "Dark" },
  { value: "wild", label: "Wild" },
  { value: "epic", label: "Epic" },
];

export default function IdeaGeneration() {
  const [selectedFilters, setSelectedFilters] = useState<IdeaFilters>({
    level: "",
    category: [],
    mood: "",
    randomMood: true
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedContentType | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const generateContentMutation = useMutation({
    mutationFn: async (filters: IdeaFilters) => {
      // Convert to the expected FilterSelection format
      const apiFilters = {
        level: filters.level,
        category: filters.category,
        mood: filters.randomMood ? "random" : filters.mood
      };
      const response = await apiRequest("POST", "/api/generate-content", { filters: apiFilters });
      return response.json();
    },
    onSuccess: (data: GeneratedContentType) => {
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

  const getLimits = () => {
    switch (selectedFilters.level) {
      case 'beginner':
        return { categories: 1 };
      case 'intermediate':
        return { categories: 2 };
      case 'advanced':
        return { categories: 3 };
      default:
        return { categories: 0 };
    }
  };

  const limits = getLimits();

  const handleFilterChange = (key: keyof IdeaFilters, value: any) => {
    if (key === 'category') {
      const currentCategories = selectedFilters.category;
      let newCategories: string[];

      if (currentCategories.includes(value)) {
        newCategories = currentCategories.filter(cat => cat !== value);
      } else {
        if (currentCategories.length < limits.categories) {
          newCategories = [...currentCategories, value];
        } else {
          return;
        }
      }

      setSelectedFilters(prev => ({ ...prev, category: newCategories }));
    } else if (key === 'level') {
      const newLimits = (() => {
        switch (value) {
          case 'beginner': return { categories: 1 };
          case 'intermediate': return { categories: 2 };
          case 'advanced': return { categories: 3 };
          default: return { categories: 0 };
        }
      })();

      setSelectedFilters(prev => ({
        ...prev,
        level: value,
        category: prev.category.slice(0, newLimits.categories)
      }));
    } else {
      setSelectedFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const hasSelectedFilters = () => {
    return selectedFilters.level && 
           selectedFilters.category.length >= 1 && 
           (selectedFilters.randomMood || selectedFilters.mood);
  };

  const handleExplore = () => {
    if (!hasSelectedFilters()) return;
    generateContentMutation.mutate(selectedFilters);
  };

  const handleNewGeneration = () => {
    generateContentMutation.mutate(selectedFilters);
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
        currentPage="inspiration" 
        icon={<Lightbulb className="text-white text-lg" />}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Your Inspiration
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Select your preferences and let us spark your creativity with personalized art ideas
          </p>
        </div>

        {/* Filter Section */}
        <section className="mb-8">
          <Card className="shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Level <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={selectedFilters.level}
                    onValueChange={(value) => handleFilterChange('level', value)}
                  >
                    <SelectTrigger className="w-full h-12">
                      <SelectValue placeholder="Select level" />
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

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category <span className="text-red-500">* (1-{limits.categories})</span>
                  </label>
                  <div className="border border-input rounded-md bg-background min-h-12 p-2">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {selectedFilters.category.map((selectedCat) => (
                        <span
                          key={selectedCat}
                          className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm flex items-center gap-1"
                        >
                          {categoryOptions.find(opt => opt.value === selectedCat)?.label}
                          <button
                            onClick={() => handleFilterChange('category', selectedCat)}
                            className="text-primary/60 hover:text-primary"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <Select
                      value=""
                      onValueChange={(value) => handleFilterChange('category', value)}
                      disabled={!selectedFilters.level}
                    >
                      <SelectTrigger className="w-full border-0 shadow-none h-8 p-0">
                        <SelectValue placeholder={
                          !selectedFilters.level 
                            ? "Select level first..."
                            : selectedFilters.category.length === 0 
                              ? "Select categories..."
                              : selectedFilters.category.length < limits.categories 
                                ? "Add another category..."
                                : `Maximum ${limits.categories} categories selected`
                        } />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {categoryOptions
                          .filter(({ value }) => !selectedFilters.category.includes(value))
                          .map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Mood Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mood <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="random-mood"
                        checked={selectedFilters.randomMood}
                        onCheckedChange={(checked) => handleFilterChange('randomMood', checked)}
                      />
                      <Label htmlFor="random-mood">Random</Label>
                    </div>
                    {!selectedFilters.randomMood && (
                      <Select
                        value={selectedFilters.mood}
                        onValueChange={(value) => handleFilterChange('mood', value)}
                      >
                        <SelectTrigger className="w-full h-12">
                          <SelectValue placeholder="Choose a mood" />
                        </SelectTrigger>
                        <SelectContent>
                          {moodOptions.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Selected Filters</h3>
                    <div className="flex flex-wrap gap-2 min-h-[2rem]">
                      {selectedFilters.level && (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          <WandSparkles className="mr-1 h-3 w-3" />
                          {selectedFilters.level}
                        </Badge>
                      )}
                      {selectedFilters.category.map((cat) => (
                        <Badge key={cat} className="bg-primary/10 text-primary border-primary/20">
                          <WandSparkles className="mr-1 h-3 w-3" />
                          {cat}
                        </Badge>
                      ))}
                      {(selectedFilters.randomMood || selectedFilters.mood) && (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          <WandSparkles className="mr-1 h-3 w-3" />
                          {selectedFilters.randomMood ? "Random Mood" : selectedFilters.mood}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={handleExplore}
                    disabled={!hasSelectedFilters() || generateContentMutation.isPending}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-8 py-3 font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {generateContentMutation.isPending ? "Generating..." : "Generate Idea"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Loading State */}
        {generateContentMutation.isPending && (
          <section className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Generating your creative idea...</h3>
              <p className="text-gray-600 mb-6">Finding perfect inspiration and reference photos...</p>
              <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full animate-pulse w-3/5"></div>
              </div>
            </div>
          </section>
        )}

        {/* Error State */}
        {generateContentMutation.isError && (
          <section className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="text-red-500 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
              <p className="text-gray-600 mb-6">
                {generateContentMutation.error?.message || "We couldn't generate your art idea. Please try again."}
              </p>
              <Button onClick={handleExplore} className="bg-primary hover:bg-primary/90">
                <Sparkles className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </section>
        )}

        {/* Generated Content */}
        {generatedContent && !generateContentMutation.isPending && (
          <>
            <GeneratedContent 
              content={generatedContent}
              onNewGeneration={handleNewGeneration}
              isGenerating={generateContentMutation.isPending}
              type="idea"
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