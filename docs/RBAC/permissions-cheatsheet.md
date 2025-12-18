# Quick Reference: Permissions List

This is a snapshot of common permissions available in the system.
*Always check the backend database for the single source of truth.*

## Project Management
| Permission          | Description                     | Roles Typically Assigned |
|:--------------------|:--------------------------------|:-------------------------|
| `projects.view`     | View project listings           | Client, Videographer, Editor |
| `projects.create`   | Create new job postings         | Client |
| `projects.update`   | Update own projects             | Client |
| `projects.delete`   | Delete own projects             | Client |
| `projects.apply`    | Apply to a project              | Videographer, Editor |
| `projects.withdraw` | Withdraw an active application  | Videographer, Editor |
| `projects.hire`     | Hire a freelancer               | Client |
| `projects.manage`   | Full control over own projects  | Client |

## Applications
| Permission | Description | Roles Typically Assigned |
|:---|:---|:---|
| `applications.view` | View applications (sent or received) | Client, Videographer, Editor |

## Profile
| Permission | Description | Roles Typically Assigned |
|:---|:---|:---|
| `profile.view` | View own profile | All |
| `profile.update` | Update own profile | All |
| `profile.verify` | Verify user documents | Admin, Super Admin |

## Reviews
| Permission | Description | Roles Typically Assigned |
|:---|:---|:---|
| `reviews.view` | View reviews | All |
| `reviews.create` | Write a review | All |
| `reviews.moderate`| Moderate/Hide reviews | Admin |

## Payments
| Permission | Description | Roles Typically Assigned |
|:---|:---|:---|
| `payments.view` | View own transaction history | All |
| `payments.process`| Process payouts/refunds | Admin |

## Admin Only
| Permission |
|:---|
| `users.view`, `users.ban` |
| `admin.dashboard` |
| `reports.view` |
| `content.publish` |
