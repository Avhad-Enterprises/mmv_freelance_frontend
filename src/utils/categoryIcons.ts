// Utility function to map job categories to appropriate icons
export const getCategoryIcon = (category: string | undefined): string => {
  if (!category) return '💼'; // Default briefcase icon

  const categoryLower = category.toLowerCase();

  // Video & Media Production
  if (categoryLower.includes('video') || categoryLower.includes('film') || categoryLower.includes('cinema')) {
    return '🎥';
  }

  // Audio & Music
  if (categoryLower.includes('audio') || categoryLower.includes('music') || categoryLower.includes('sound')) {
    return '🎵';
  }

  // Design & Graphics
  if (categoryLower.includes('design') || categoryLower.includes('graphic') || categoryLower.includes('art')) {
    return '🎨';
  }

  // Web Development
  if (categoryLower.includes('web') || categoryLower.includes('development') || categoryLower.includes('programming')) {
    return '💻';
  }

  // Marketing & Advertising
  if (categoryLower.includes('marketing') || categoryLower.includes('advertising') || categoryLower.includes('brand')) {
    return '📢';
  }

  // Photography
  if (categoryLower.includes('photo') || categoryLower.includes('photography')) {
    return '📸';
  }

  // Animation
  if (categoryLower.includes('animation') || categoryLower.includes('motion')) {
    return '🎬';
  }

  // Writing & Content
  if (categoryLower.includes('writing') || categoryLower.includes('content') || categoryLower.includes('copy')) {
    return '✍️';
  }

  // Social Media
  if (categoryLower.includes('social') || categoryLower.includes('media')) {
    return '📱';
  }

  // Business & Consulting
  if (categoryLower.includes('business') || categoryLower.includes('consulting')) {
    return '💼';
  }

  // Education & Training
  if (categoryLower.includes('education') || categoryLower.includes('training') || categoryLower.includes('tutorial')) {
    return '📚';
  }

  // Gaming & Entertainment
  if (categoryLower.includes('game') || categoryLower.includes('gaming') || categoryLower.includes('entertainment')) {
    return '🎮';
  }

  // Default fallback
  return '💼';
};

// Get background color based on category
export const getCategoryColor = (category: string | undefined): string => {
  if (!category) return '#FFFFFF'; // Default white background

  const categoryLower = category.toLowerCase();

  // Video & Media Production - White background
  if (categoryLower.includes('video') || categoryLower.includes('film') || categoryLower.includes('cinema')) {
    return '#FFFFFF';
  }

  // Audio & Music - Light gray
  if (categoryLower.includes('audio') || categoryLower.includes('music') || categoryLower.includes('sound')) {
    return '#F8F9FA';
  }

  // Design & Graphics - Light gray
  if (categoryLower.includes('design') || categoryLower.includes('graphic') || categoryLower.includes('art')) {
    return '#F8F9FA';
  }

  // Web Development - Light gray
  if (categoryLower.includes('web') || categoryLower.includes('development') || categoryLower.includes('programming')) {
    return '#F8F9FA';
  }

  // Marketing & Advertising - Light gray
  if (categoryLower.includes('marketing') || categoryLower.includes('advertising') || categoryLower.includes('brand')) {
    return '#F8F9FA';
  }

  // Photography - Light gray
  if (categoryLower.includes('photo') || categoryLower.includes('photography')) {
    return '#F8F9FA';
  }

  // Animation - Light gray
  if (categoryLower.includes('animation') || categoryLower.includes('motion')) {
    return '#F8F9FA';
  }

  // Writing & Content - Light gray
  if (categoryLower.includes('writing') || categoryLower.includes('content') || categoryLower.includes('copy')) {
    return '#F8F9FA';
  }

  // Social Media - Light gray
  if (categoryLower.includes('social') || categoryLower.includes('media')) {
    return '#F8F9FA';
  }

  // Business & Consulting - Light gray
  if (categoryLower.includes('business') || categoryLower.includes('consulting')) {
    return '#F8F9FA';
  }

  // Education & Training - Light gray
  if (categoryLower.includes('education') || categoryLower.includes('training') || categoryLower.includes('tutorial')) {
    return '#F8F9FA';
  }

  // Gaming & Entertainment - Light gray
  if (categoryLower.includes('game') || categoryLower.includes('gaming') || categoryLower.includes('entertainment')) {
    return '#F8F9FA';
  }

  // Default white background
  return '#FFFFFF';
};

// Get text color based on category (for contrast with background)
export const getCategoryTextColor = (category: string | undefined): string => {
  // Since we're using white/light backgrounds, use dark text for contrast
  return '#333333';
};