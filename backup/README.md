# Backup Archive

This folder contains unused code that has been moved from the active codebase to keep the project organized.

## Moved Items

### Pages (moved to backup/pages/)
- home-2 through home-7: Alternative home page variants
- blog-v1, blog-v3: Alternative blog page layouts
- candidate-profile-v1, candidate-profile-v2: Alternative candidate profile pages
- candidates-v3, candidates-v4: Demo candidates pages with static data (only used in feature components, candidates-v1 is the main functional page)
- company-v1 through company-v4: Alternative company pages
- job-details-v1, job-details-v2: Alternative job detail pages
- job-grid-v2, job-grid-v3: Incomplete job grid layouts (commented out code, don't render jobs despite navigation links)
- job-list-v2, job-list-v3: Alternative job list layouts (v2 has commented out code, doesn't render jobs)
- job-search: Job search page
- job-wishlist: Job wishlist page
- edit-projects: Project editing functionality
- forgot-password: Password recovery page
- reset_password: Password reset page
- coming-soon: Coming soon page
- cookies: Cookie policy page
- faq: FAQ page
- privacy-policy: Privacy policy page
- terms-condition: Terms and conditions page
- application: Duplicate application details page (inferior version, applications/ is kept active)
- blog-details: Blog details page

### Components (moved to backup/components/)
- expert-member: Expert member display component (only used in backed-up home pages)
- search-area: Search area component (only used in backed-up job-search page)
- top-company: Top company display component (only used in backed-up home-7 page)

## Reason for Moving
These files were identified as unused in the current active codebase through systematic import analysis. They were moved here to:
- Reduce clutter in the active src/ directory
- Preserve code for potential future use
- Improve development experience and build times

## Restoration
If any of these files are needed in the future, they can be moved back to their original locations. Be sure to update any import paths that may have changed.