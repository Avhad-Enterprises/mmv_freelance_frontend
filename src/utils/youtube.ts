/**
 * YouTube URL Utilities
 * 
 * Provides functions for extracting video IDs and generating thumbnails
 * from various YouTube URL formats.
 */

/**
 * Extracts YouTube video ID from various YouTube URL formats
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, youtube.com/embed/, youtube.com/v/
 * 
 * @param url - The YouTube URL to extract video ID from
 * @returns The 11-character video ID or null if not found
 */
export const extractYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  const patterns = [
    // youtube.com/watch?v=VIDEO_ID (standard watch URL)
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // youtu.be/VIDEO_ID (shortened URL)
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // youtube.com/shorts/VIDEO_ID (YouTube Shorts)
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    // youtube.com/embed/VIDEO_ID (embed URL)
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // youtube.com/v/VIDEO_ID (old embed format)
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    // m.youtube.com/watch?v=VIDEO_ID (mobile)
    /(?:m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

/**
 * Checks if a URL is a valid YouTube URL
 * 
 * @param url - The URL to check
 * @returns True if the URL is a valid YouTube URL
 */
export const isYouTubeUrl = (url: string): boolean => {
  return extractYouTubeVideoId(url) !== null;
};

/**
 * Gets YouTube thumbnail URL from video ID
 * 
 * @param videoId - The YouTube video ID (11 characters)
 * @param quality - The thumbnail quality (default, medium, high, standard, maxres)
 * @returns The thumbnail URL
 */
export const getYouTubeThumbnail = (
  videoId: string, 
  quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'high'
): string => {
  const qualityMap = {
    default: 'default',      // 120x90
    medium: 'mqdefault',     // 320x180
    high: 'hqdefault',       // 480x360
    standard: 'sddefault',   // 640x480
    maxres: 'maxresdefault', // 1280x720
  };
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
};

/**
 * Generates YouTube embed URL from video ID
 * 
 * @param videoId - The YouTube video ID
 * @param autoplay - Whether to autoplay the video
 * @returns The embed URL
 */
export const getYouTubeEmbedUrl = (videoId: string, autoplay: boolean = false): string => {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: '0', // Don't show related videos
    modestbranding: '1', // Minimal YouTube branding
  });
  
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};

/**
 * Generates YouTube watch URL from video ID
 * 
 * @param videoId - The YouTube video ID
 * @returns The standard watch URL
 */
export const getYouTubeWatchUrl = (videoId: string): string => {
  return `https://www.youtube.com/watch?v=${videoId}`;
};
