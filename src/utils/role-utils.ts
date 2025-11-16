/**
 * Shared role mapping utilities
 * Consolidates duplicate role mapping logic across the application
 */

export const ROLE_MAP = {
  'freelancer': 'Freelancer',
  'videographer': 'Videographer',
  'videoeditor': 'Video Editor',
  'video_editor': 'Video Editor',
  'client': 'Client'
} as const;

export type RoleKey = keyof typeof ROLE_MAP;

/**
 * Normalize a role string to display format
 * @param role - The role string to normalize
 * @returns The normalized display role
 */
export const normalizeRole = (role: string): string => {
  return ROLE_MAP[role.toLowerCase() as RoleKey] || role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Normalize an array of roles to display format
 * @param roles - Array of role strings to normalize
 * @returns Array of normalized display roles
 */
export const normalizeRoles = (roles: string[]): string[] => {
  return roles.map(role => normalizeRole(role));
};