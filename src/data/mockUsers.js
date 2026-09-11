// Empty fresh datasets for real users & real live chat
export const INITIAL_PROFILES = [];
export const INITIAL_WALL_POSTS = [];

// Helper function to generate clean SVG / color avatar for fresh user profiles without uploading photos
export function getAvatarBadge(name = '', gender = 'Male') {
  const initial = name ? name.trim().charAt(0).toUpperCase() : '?';
  const isFemale = gender === 'Female';
  const bgColor = isFemale ? 'from-purple-500 to-pink-500' : 'from-indigo-600 to-purple-600';
  
  return {
    initial,
    gradient: bgColor,
    genderEmoji: isFemale ? '👧' : gender === 'Male' ? '👦' : '✨'
  };
}
