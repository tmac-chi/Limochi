import type { Express } from "express";
import { createServer, type Server } from "http";
import { generateContentSchema, generatedContentSchema } from "@shared/schema";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_API_KEY || "";

// Constants
const PHOTOS_PER_PAGE = 6;
const MAX_PAGES = 5;
const GALLERY_PHOTOS_PER_PAGE = 24;

// Category subcategories database
const categorySubcategories = {
  nature: ["dog", "cat", "mouse", "lion", "seal", "whale", "stingray", "elephant", "tiger", "bird", "raccoon", "bear", "fox", "rabbit", "squirrel", "deer", "penguin", "lizard", "bee", "butterfly", "peacock", "horse", "pig","cow", "crocodile", "duck", "goat", "eagle", "giraffe", "oak tree", "pine tree", "deer", "waterfall", "mushroom", "fern", "fox", "owl", "cabin", "canopy", "lake", "pebble", "grass field", "wildflowers", "butterfly", "bee", "stream", "hills", "sheep", "windmill", "meadow", "rose", "sunflower", "tulip", "orchid", "lily", "daisy", "cherry blossom", "lavender", "peony", "iris", "peak", "valley", "cliff", "cave", "glacier", "hiking trail", "eagle", "waterfall", "pine forest", "wave", "coral reef", "dolphin", "jellyfish"],
  fantasy: ["elf", "fairy", "fae", "goblin", "dragon", "unicorn", "org", "wizard", "witch" ,"necromancer", "dwarf", "siren", "mermaid", "merman", "pegasus", "cyclop", "nine-tail fox", "vampire", "werewolf", "old god", "saint", "angel", "goddess", "forgotten god", "kraken", "banshee","griffin", "phoenix", "centaur", "chimera", "Sun Wukong", "mummy"],
  objects: ["chair", "stool", "dining table", "lamp", "standing desk", "murphy bed", "old sofa", "cup of tea", "stack of book", "pile of clothes", "broken glass", "reading glasses", "old camera", "typewriter", "teleprompter", "kitchen knife", "sword", "axe", "hammer", "microphone", "guitar", "piano", "violin", "drum set", "flute", "kite", "balloon", "teddy bear", "heater", "bottle of champage", "coca-cola can", "pair of sandals", "old shoe", "leather wallet", "handbag", "fountain pen", "ballpoint pen", "open window", "old swing","computer", "smartphone", "satellite", "circuit", "hologram", "VR headset", "solar panel", "rocket", "laser", "flying car", "car", "building", "space elevator", "laptop", "notebook",  "treasure chest", "submarine", "sports car", "vintage truck", "motorcycle", "sailboat", "helicopter", "train", "bicycle", "hot air balloon"],
  food: ["croissant", "matcha latte", "cappuchino", "latte machiato", "gelato", "pizza", "spaghetti", "sushi", "ramen", "sandwich", "cake", "cookie", "candy", "orange", "apple", "tropical fruit", "cocktail", "waffle", "pancake", "beef roast", "salad", "soup", "oyster", "turkey", "milk", "beer"],
  worlds: ["outer space", "galaxy", "inside of a spaceship", "mountains", "volcano", "ancient city", "futuristic city", "city", "savannah", "cyberpunk neighborhood", "medieval village", "hamlet", "stone age village", "futuristic ruins", "underwater city", "canyon", "tropical forest", "winter wonderland", "summer island", "salt mine", "gold mine", "Cold-War meeting room", "office", "library", "elementary school", "urban jungle", "suburban area", "shipwreck", "inside of a submarine"],
  architecture: ["cathedral", "modern house", "bridge", "tower", "pavilion", "courtyard", "archway", "dome", "spiral staircase", "glass building", "shelter", "underground train", "underground station", "bus stop", "temple", "mosque", "lighthouse", "wind turbine", "city park", "car park", "cafe", "restaurant", "street vendor", "market"],
  character: ["singer", "ballerina", "dancer", "musician", "magician", "office worker", "software developer", "painter", "writer", "photographer", "chef", "waiter", "waitress", "queen", "king", "prince", "princess", "soldier", "knight", "firefighter", "salesman", "doctor", "nurse", "teacher", "athlete", "scientist", "politician", "housewife", "homeless person", "thief", "detective", "spy", "astronaunt", "blacksmith", "fisherman", "farmer"],
  abstract: ["symbol of hope", "symbol of dream", "symbol of despair", "symbol of anger", "symbol of joy", "symbol of sadness", "symbol of love", "symbol of hate", "symbol of fear", "symbol of courage", "symbol of curiosity", "symbol of ambition", "symbol of desire", "symbol of grief", "symbol of envy", "symbol of pride", "symbol of anxiety", "symbol of chaos", "symbol of void", "symbol of serentiy"],
};
const styleKeywords = {
    "manga": ["manga", "anime"],
    "3d": ["3d render", "three dimensional"],
    "2d": ["flat design", "illustration"],
    "ink-wash": ["ink wash", "sumi-e"],
    "cartoon": ["cartoon", "animated"],
    "chibi": ["chibi", "cute"],
    "realism": ["realistic", "photorealistic"],
    "photorealistic": ["photorealistic", "hyperrealistic"],
    "surrealism": ["surreal", "dreamlike"],
    "abstract": ["abstract", "non-representational"],
    "contemporary": ["contemporary", "modern"],
    "minimalist": ["minimalist", "simple"],
    "impressionist": ["impressionist", "soft brushstrokes"],
    "expressionist": ["expressionist", "emotional"],
    "cubist": ["cubist", "geometric"],
    "pop-art": ["pop art", "bright colors"],
    "line-drawing": ["line drawing", "sketch"],
    "caricature": ["caricature", "exaggerated"],
    "minimalism": ["minimalism", "clean"],
    "sketch": ["sketch", "pencil drawing"]
  };

  const moodKeywords = {
    soft: ["melancholic", "romantic", "lonely"],
    dark: ["noir", "eerie", "dystopian", "gritty", "mysterious"],
    wild: ["chaotic", "whimsical", "dreamy", "surreal"],
    epic: ["majestic", "dramatic", "utopian", "epic"],
  };

  const tools = [
    "watercolor", "acrylic paint", "oil paint", "colored pencils", "charcoal", 
    "pastels", "digital art", "ink", "gouache", "markers", "graphite pencil",
    "pen and ink", "tempera", "spray paint", "chalk", "crayons"
  ];

function getRandomSubcategory(category: string): string {
  const subcategories = categorySubcategories[category as keyof typeof categorySubcategories];
  if (!subcategories || subcategories.length === 0) return category;
  return subcategories[Math.floor(Math.random() * subcategories.length)];
}

function getRandomSubMood(mood: string): string {
  const subMoods = moodKeywords[mood as keyof typeof moodKeywords];
  if (!subMoods || subMoods.length === 0) return mood;
  return subMoods[Math.floor(Math.random() * subMoods.length)];
}

function generateSentence(filters: any, selectedSubcategories: string[]): string {
  // Build category part of sentence
  let categoryPart = selectedSubcategories[0];
  if (selectedSubcategories.length === 2) {
    categoryPart = `${selectedSubcategories[0]} and ${selectedSubcategories[1]}`;
  } else if (selectedSubcategories.length === 3) {
    categoryPart = `${selectedSubcategories[0]} and ${selectedSubcategories[1]} and ${selectedSubcategories[2]}`;
  }

  // Handle mood selection
  let moodWord: string;
  if (filters.mood === "random") {
    // Get a random mood category, then a random sub-mood from that category
    const moodCategories = Object.keys(moodKeywords);
    const randomMoodCategory = moodCategories[Math.floor(Math.random() * moodCategories.length)];
    moodWord = getRandomSubMood(randomMoodCategory);
  } else {
    // Get a random sub-mood from the selected mood category
    moodWord = getRandomSubMood(filters.mood);
  }

  // Generate the prompt sentence with mood
  const sentence = `Imagine a combination of ${moodWord} ${categoryPart}`;

  return sentence;
}

function extractKeywords(subcategories: string[], style?: string): string[] {
  const keywords = [...subcategories];
  if (style) keywords.push(style);

  return keywords;
}

async function fetchUnsplashPhotos(keywords: string[]): Promise<any[]> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn("No Unsplash API key provided, returning empty photos array");
    return [];
  }

  try {
    console.log("🔍 Keywords used for Unsplash search:", keywords);

      const photoPromises = keywords.map((keyword) => {
      const cacheBuster = Date.now(); // Ensures uniqueness
      const page = Math.floor(Math.random() * MAX_PAGES) + 1; // Random page 1–5

      // You can switch order_by to 'relevant' to make page effective
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=${PHOTOS_PER_PAGE}&page=${page}&orientation=landscape&order_by=relevant&cb=${cacheBuster}`;

      console.log(`Fetching Unsplash: ${url}`); // ✅ Debug log

      return fetch(url, {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`API error ${res.status}`);
          return res.json();
        })
        .then((data) => data.results || []);
    });

    const photoResults = await Promise.all(photoPromises);
    const photos = photoResults.flat();
    console.log("🖼️ Photo IDs fetched:", photos.map((p) => p.id));

    return photos;
  } catch (error) {
    console.error("Error fetching photos from Unsplash:", error);
    return [];
  }
}

export async function registerRoutes(app: Express): Promise<Server> {

  // Gallery search endpoint - reuses the same Unsplash API key
  app.get("/api/gallery/search", async (req, res) => {
    try {
      const { query, page = 1, per_page = GALLERY_PHOTOS_PER_PAGE } = req.query;

      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Query parameter is required" });
      }

      if (!UNSPLASH_ACCESS_KEY) {
        return res.status(500).json({ message: "Unsplash API key not configured" });
      }

      const cacheBuster = Date.now();
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${per_page}&page=${page}&orientation=landscape&order_by=relevant&cb=${cacheBuster}`;

      console.log(`🔍 Gallery search for: "${query}" (page ${page})`);

      const response = await fetch(url, {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }

      const data = await response.json();
      const photos = data.results || [];

      console.log(`📸 Found ${photos.length} photos for gallery search: "${query}"`);

      res.json({ 
        photos,
        total: data.total,
        total_pages: data.total_pages,
        query: query
      });
    } catch (error) {
      console.error("Error in gallery search:", error);
      res.status(500).json({ 
        message: "Failed to search photos. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Challenge generation endpoint
  app.post("/api/generate-challenge", async (req, res) => {
    try {
      const { level } = req.body;

      if (!level || !["beginner", "intermediate", "advanced"].includes(level)) {
        return res.status(400).json({ message: "Valid skill level is required" });
      }

      let sentence: string;
      let keywords: string[] = [];

      // Get random tool
      const randomTool = tools[Math.floor(Math.random() * tools.length)];

      if (level === "beginner") {
        // Get one random subcategory from any category
        const categories = Object.keys(categorySubcategories);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const subcategory = getRandomSubcategory(randomCategory);
        
        sentence = `Create a painting of ${subcategory}`;
        keywords = [subcategory, randomTool];
      } else if (level === "intermediate") {
        // Get two random subcategories from different categories
        const categories = Object.keys(categorySubcategories);
        const category1 = categories[Math.floor(Math.random() * categories.length)];
        let category2 = categories[Math.floor(Math.random() * categories.length)];
        while (category2 === category1) {
          category2 = categories[Math.floor(Math.random() * categories.length)];
        }
        
        const subcategory1 = getRandomSubcategory(category1);
        const subcategory2 = getRandomSubcategory(category2);
        
        sentence = `Create a painting with ${subcategory1} and ${subcategory2} using ${randomTool}`;
        keywords = [subcategory1, subcategory2, randomTool];
      } else { // advanced
        // Get three random subcategories and a style
        const categories = Object.keys(categorySubcategories);
        const category1 = categories[Math.floor(Math.random() * categories.length)];
        let category2 = categories[Math.floor(Math.random() * categories.length)];
        while (category2 === category1) {
          category2 = categories[Math.floor(Math.random() * categories.length)];
        }
        let category3 = categories[Math.floor(Math.random() * categories.length)];
        while (category3 === category1 || category3 === category2) {
          category3 = categories[Math.floor(Math.random() * categories.length)];
        }
        
        const subcategory1 = getRandomSubcategory(category1);
        const subcategory2 = getRandomSubcategory(category2);
        const subcategory3 = getRandomSubcategory(category3);
        
        // Get random style
        const styles = Object.keys(styleKeywords);
        const randomStyle = styles[Math.floor(Math.random() * styles.length)];
        
        sentence = `Create a painting with ${subcategory1} and ${subcategory2} and ${subcategory3} using ${randomTool} in the style of ${randomStyle}`;
        keywords = [subcategory1, subcategory2, subcategory3, randomTool, randomStyle];
      }

      // Fetch photos from Unsplash
      const photos = await fetchUnsplashPhotos(keywords);

      const result = {
        sentence,
        photos,
        keywords
      };

      console.log(`Generated ${level} challenge: "${sentence}" with ${photos.length} photos`);

      res.json(result);
    } catch (error) {
      console.error("Error generating challenge:", error);
      res.status(500).json({ 
        message: "Failed to generate challenge. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Load more photos endpoint
  app.post("/api/load-more-photos", async (req, res) => {
    try {
      const { keywords } = req.body;

      if (!keywords || !Array.isArray(keywords)) {
        return res.status(400).json({ message: "Keywords array is required" });
      }

      // Fetch more photos using the same keywords
      const photos = await fetchUnsplashPhotos(keywords);

      console.log(`Loaded ${photos.length} more photos for keywords: [${keywords.join(', ')}]`);

      res.json({ photos });
    } catch (error) {
      console.error("Error loading more photos:", error);
      res.status(500).json({ 
        message: "Failed to load more photos. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/generate-content", async (req, res) => {
    try {
      const body = generateContentSchema.parse(req.body);
      const { filters } = body;

      // Select random subcategories from each selected category (only once)
      const selectedSubcategories = filters.category.map(category => 
        getRandomSubcategory(category)
      );

      // Generate sentence
      const sentence = generateSentence(filters, selectedSubcategories);

      // Extract keywords for photo search
      const keywords = extractKeywords(selectedSubcategories, filters.style);

      // Fetch photos from Unsplash
      const photos = await fetchUnsplashPhotos(keywords);

      const result = {
        sentence,
        photos,
        keywords
      };

      // Log a cleaner summary instead of the full response
      console.log(`Generated: "${sentence}" with ${photos.length} photos for keywords: [${keywords.join(', ')}]`);

      res.json(result);
    } catch (error) {
      console.error("Error generating content:", error);
      res.status(500).json({ 
        message: "Failed to generate content. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}