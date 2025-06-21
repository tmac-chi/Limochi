
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2, AlertCircle, WandSparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { LoadingState } from "@/components/common/loading-state";
import { ErrorState } from "@/components/common/error-state";

// Define the photo type based on Unsplash API response
interface UnsplashPhoto {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    username: string;
  };
  description: string | null;
}

// Function to fetch photos from our server API (which uses the same Unsplash key)
const fetchUnsplashPhotos = async (query: string, page: number = 1): Promise<UnsplashPhoto[]> => {
  const response = await fetch(
    `/api/gallery/search?query=${encodeURIComponent(query)}&page=${page}&per_page=24`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Gallery search error: ${response.status}`);
  }

  const data = await response.json();
  return data.photos || [];
};

export default function Gallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allPhotos, setAllPhotos] = useState<UnsplashPhoto[]>([]);

  // React Query hook to fetch photos with caching and loading states
  const { data: photos, isLoading, error, refetch } = useQuery({
    queryKey: ["gallery-photos", activeQuery, currentPage],
    queryFn: () => fetchUnsplashPhotos(activeQuery, currentPage),
    enabled: !!activeQuery, // Only fetch when there's an active query
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Reset state for new search
    setActiveQuery(searchQuery.trim());
    setCurrentPage(1);
    setAllPhotos([]);
  };

  // Handle loading more photos (pagination)
  const handleLoadMore = () => {
    if (photos && photos.length > 0) {
      // Add current photos to the accumulated list
      setAllPhotos(prev => [...prev, ...photos]);
      // Increment page to fetch next set
      setCurrentPage(prev => prev + 1);
    }
  };

  // Combine photos from all pages for display
  const displayPhotos = currentPage === 1 ? (photos || []) : [...allPhotos, ...(photos || [])];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentPage="gallery" 
        icon={<WandSparkles className="text-white text-lg" />}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Search */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Visual Inspiration
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Already have an idea in mind but not sure how to bring your vision to life? Let us help you find the perfect visual inspiration. 
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for photos... (e.g., nature, architecture, animals)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-32 text-lg border-2 border-gray-200 focus:border-primary rounded-full"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Button
                type="submit"
                disabled={!searchQuery.trim() || isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-6 rounded-full bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Loading State */}
        {isLoading && currentPage === 1 && (
          <LoadingState 
            title="Searching for photos"
            description={`Finding the best visual inspiration for "${activeQuery}"...`}
          />
        )}

        {/* Error State */}
        {error && (
          <ErrorState
            title="Something went wrong"
            description="We couldn't fetch photos right now. Please try again with a different search term."
            onRetry={() => refetch()}
            retryLabel="Try Again"
          />
        )}

        {/* Photos Gallery Grid */}
        {displayPhotos.length > 0 && (
          <div className="space-y-8">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                Search Results for "{activeQuery}"
              </h3>
              <p className="text-gray-600">
                {displayPhotos.length} photo{displayPhotos.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Photo Grid - Responsive masonry-style layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayPhotos.map((photo) => (
                <Card
                  key={`${photo.id}-${currentPage}`} // Unique key to prevent duplicates
                  className="overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl group"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    {/* Photo Image */}
                    <img
                      src={photo.urls.small}
                      alt={photo.alt_description || photo.description || "Photo"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Overlay with photo info - appears on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-end">
                      <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-sm font-medium">
                          by {photo.user.name}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Photo Details */}
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                      {photo.alt_description || photo.description || "Untitled"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Photo by {photo.user.name}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            {photos && photos.length === 24 && ( // Show if we got a full page of results
              <div className="text-center pt-8">
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg"
                  size="lg"
                >
                  {isLoading && currentPage > 1 ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Loading More...
                    </>
                  ) : (
                    "Load More Photos"
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Empty State - when search returns no results */}
        {displayPhotos.length === 0 && activeQuery && !isLoading && !error && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-gray-400 text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No photos found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any photos matching "{activeQuery}". Try a different search term.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setActiveQuery("");
                  setAllPhotos([]);
                }} 
                variant="outline"
              >
                Clear Search
              </Button>
            </div>
          </div>
        )}

        {/* Initial State - before any search */}
        {!activeQuery && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-primary text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Start exploring</h3>
              <p className="text-gray-600">
                Enter a search term above to discover beautiful photos and visual inspiration
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2024 Limochi Gallery. Powered by Unsplash API.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
