
export const API_CONSTANTS = {
  PHOTOS_PER_PAGE: 24,
  PHOTOS_PER_SEARCH: 6,
  LOAD_MORE_TIMEOUT: 1000,
  SCROLL_TIMEOUT: 100,
  CACHE_TIME: 5 * 60 * 1000, // 5 minutes
} as const;

export const SKILL_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

export const CATEGORY_OPTIONS = [
  { value: "nature", label: "Nature" },
  { value: "fantasy", label: "Fantasy" },
  { value: "objects", label: "Objects" },
  { value: "food", label: "Food" },
  { value: "worlds", label: "Worlds" },
  { value: "architecture", label: "Architecture" },
  { value: "characters", label: "Characters" },
  { value: "abstract", label: "Abstract" },
] as const;

export const MOOD_OPTIONS = [
  { value: "soft", label: "Soft" },
  { value: "dark", label: "Dark" },
  { value: "wild", label: "Wild" },
  { value: "epic", label: "Epic" },
] as const;
