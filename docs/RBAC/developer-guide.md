# Frontend RBAC Integration Guide

This guide explains how to use the Role-Based Access Control (RBAC) system in the `mmv_freelance_frontend` application.

## 1. Overview

The RBAC system controls what users can **SEE** (UI elements) and **ACCESS** (Routes).
Instead of checking for *Roles* (e.g., `if (user.role === 'CLIENT')`), we now check for **Permissions** (e.g., `if (can('projects.create'))`).

**Key Concept**: Permissions are embedded in the user's JWT token and automatically loaded into the `UserContext`.

---

## 2. Conditional UI Rendering

Use the `<PermissionGuard>` component to show or hide elements based on permissions.

### Basic Usage
wraps content that should only be visible to authorized users.

```tsx
import PermissionGuard from "@/components/auth/PermissionGuard";

// Inside your component
<PermissionGuard permission="projects.create">
  <button onClick={createJob}>Post a Job</button>
</PermissionGuard>
```

### With Fallback
Show a message or alternative UI if access is denied.

```tsx
<PermissionGuard 
  permission="analytics.view" 
  fallback={<p>Upgrade to Premium to see analytics</p>}
>
  <AnalyticsDashboard />
</PermissionGuard>
```

---

## 3. Protecting Routes (Pages)

To prevent users from accessing a page via URL (e.g., `/dashboard/client-dashboard/submit-job`), wrap the entire page content with `<PermissionGuard>` and provide a fallback.

```tsx
// src/app/dashboard/some-protected-page/page.tsx
'use client';
import PermissionGuard from "@/components/auth/PermissionGuard";

const ProtectedPage = () => {
  return (
    <PermissionGuard 
      permission="projects.create" 
      fallback={<AccessDeniedMessage />}
    >
      <PageContent />
    </PermissionGuard>
  );
};
```

---

## 4. Checking Permissions in Logic

If you need to check permissions inside a function (e.g., before making an API call), use the `useUser` hook.

```tsx
import { useUser } from "@/context/UserContext";

const MyComponent = () => {
  const { userPermissions } = useUser();

  const handleAction = () => {
    if (userPermissions.includes('projects.delete')) {
      // Perform delete action
    } else {
      alert("You don't have permission to do this!");
    }
  };
};
```

---

## 5. Middleware Protection (Advanced)

Global route protection is configured in `src/middleware/auth-middleware.tsx`. Use this to redirect users before the page even loads.

```tsx
// Example usage in layout or page wrapper
<AuthMiddleware allowedPermissions={['projects.view']}>
  {children}
</AuthMiddleware>
```

---

## 6. Permission Reference

Common permissions you might use:

| Permission | Description |
| :--- | :--- |
| `projects.view` | View job listings |
| `projects.create` | Post a new job (Clients) |
| `projects.apply` | Apply to a job (Freelancers) |
| `projects.withdraw` | Withdraw an application |
| `applications.view` | View received/sent applications |
| `profile.update` | Edit profile |

*For a full list of available permissions, refer to the Backend API Documentation.*
