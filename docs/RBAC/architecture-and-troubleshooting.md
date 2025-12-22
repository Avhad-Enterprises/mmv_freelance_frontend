# RBAC Architecture & Troubleshooting

This document explains the technical implementation of RBAC for maintainers and advanced debugging.

## Architecture Data Flow

1.  **Login (Backend)**:
    *   User logs in via Email/Password or OAuth.
    *   Backend fetches user's Roles from `user_roles` table.
    *   Backend fetches Permissions associated with those Roles from `role_permission` table.
    *   **Crucial Step**: Permissions are embedded into the **JWT Token payload** as a `permissions` array.

2.  **Request (Frontend)**:
    *   Frontend receives the JWT and stores it in cookies.
    *   `UserContext` decodes the JWT using `jwt-decode`.
    *   The `permissions` array is extracted and stored in React State (`UserContext`).

3.  **Enforcement**:
    *   `PermissionGuard` checks `userPermissions.includes(requiredPermission)`.
    *   Backend API Middleware (`authMiddleware`) also checks `req.user.permissions`.

## Zero-Latency Design

This system is "Zero-Latency" because the frontend **does not need to query the database** or make an API call to check permissions. They are instantly available in the token.

**Trade-off**: If a user's permissions are changed in the database, they will not update until the user **logs out and logs back in** (refreshing the token).

---

## Troubleshooting Guide

### 1. "Access Denied" (403 Error)
*   **Symptom**: User sees a 403 error or Red "Access Denied" banner.
*   **Cause**: The user's token does not have the required permission.
*   **Fix**:
    1.  Check `scripts/seed-role-permissions.ts` in the API to see if the Role has the Permission.
    2.  If you just updated the DB, **Log Out and Log In** to get a new token.
    3.  Inspect the token using a tool like `jwt.io` (or `console.log(decodedToken)` in `UserContext`) to see the raw permissions list.

### 2. Button Not Showing
*   **Symptom**: A button wrapped in `<PermissionGuard>` is invisible.
*   **Debug**:
    *   Check the `permission` prop on the guard. Does it match the backend string exactly (e.g., `projects.create` vs `project.create`)?
    *   Is the `UserContext` loaded? (Check if `isLoading` is true).

### 3. Infinite Redirect
*   **Symptom**: Page keeps reloading or redirecting to login.
*   **Cause**: Middleware is enforcing a permission the user doesn't have, and the redirect destination also requires permissions.
*   **Fix**: Ensure the "Access Denied" custom page (if exists) is public.

## Adding New Permissions

1.  **Backend**: Add the string to `seed-permissions.ts` (e.g., `new_feature.use`).
2.  **Backend**: Assign it to roles in `seed-role-permissions.ts`.
3.  **Backend**: Run `npm run seed:rbac`.
4.  **Frontend**: Use it in `<PermissionGuard permission="new_feature.use" />`.

### Example: Credit Permissions Already Added

The following credit permissions have been added to the backend:

**Freelancer Permissions** (in `seed-permissions.ts`):
```typescript
{ name: 'credits.view_own', description: 'View own credit balance' },
{ name: 'credits.view_packages', description: 'View credit packages' },
{ name: 'credits.purchase', description: 'Purchase credits' },
{ name: 'credits.view_history', description: 'View credit history' },
{ name: 'credits.request_refund', description: 'Request credit refund' },
```

**Admin Permissions**:
```typescript
{ name: 'credits.admin.view_all', description: 'View all credit transactions' },
{ name: 'credits.admin.adjust', description: 'Adjust user credits' },
{ name: 'credits.admin.analytics', description: 'View credit analytics' },
{ name: 'credits.admin.refund', description: 'Process refunds' },
{ name: 'credits.admin.export', description: 'Export transactions' },
```

**Role Assignments** (in `seed-role-permissions.ts`):
- `VIDEOGRAPHER` & `VIDEO_EDITOR`: All `credits.*` (non-admin) permissions
- `ADMIN`: All `credits.admin.*` permissions

