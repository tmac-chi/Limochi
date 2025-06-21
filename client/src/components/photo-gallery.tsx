import { Card, CardContent } from "@/components/ui/card";
import type { Photo } from "@shared/schema";

interface PhotoGalleryProps {
  photos: Photo[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  if (photos.length === 0) {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <svg className="mr-3 h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Visual Inspiration
        </h3>
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-gray-600">No photos available. This may be due to API limitations or network issues.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <svg className="mr-3 h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Visual Inspiration
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <Card 
            key={photo.id} 
            className="overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={photo.urls.small}
                alt={photo.alt_description || "Visual inspiration"}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
            <CardContent className="p-4">
              <h4 className="font-semibold text-gray-900 mb-1">
                {photo.alt_description || "Untitled"}
              </h4>
              <p className="text-sm text-gray-600">
                Photo by {photo.user.name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
