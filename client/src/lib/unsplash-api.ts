export interface UnsplashPhoto {
  id: string;
  urls: {
    small: string;
    regular: string;
  };
  alt_description: string | null;
  user: {
    name: string;
  };
}

export interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

export async function searchUnsplashPhotos(
  query: string,
  perPage: number = 6
): Promise<UnsplashPhoto[]> {
  const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn("No Unsplash API key provided");
    return [];
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data: UnsplashSearchResponse = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching photos from Unsplash:", error);
    return [];
  }
}
