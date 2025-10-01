# Frontend Authentication Middleware

This directory contains authentication middleware components that protect routes and ensure proper access control based on user account types.

## Components

### 1. `AuthMiddleware` (Base Component)
The core authentication middleware that handles:
- Token validation
- Account type verification
- Automatic redirects
- Loading states

**Props:**
- `children`: React components to render if authorized
- `allowedAccountTypes`: Array of allowed account types (e.g., `['freelancer']`, `['client']`, `['freelancer', 'client']`)
- `redirectTo`: Redirect path for unauthorized users (default: `/login`)

### 2. `FreelancerAuth`
Specific middleware for freelancer-only routes.

**Usage:**
```tsx
import FreelancerAuth from '@/middleware/freelancer-auth';

const FreelancerPage = () => {
  return (
    <FreelancerAuth>
      <div>This content is only visible to freelancers</div>
    </FreelancerAuth>
  );
};
```

### 3. `ClientAuth`
Specific middleware for client-only routes.

**Usage:**
```tsx
import ClientAuth from '@/middleware/client-auth';

const ClientPage = () => {
  return (
    <ClientAuth>
      <div>This content is only visible to clients</div>
    </ClientAuth>
  );
};
```

### 4. `DashboardAuth`
General dashboard middleware that allows both freelancers and clients.

**Usage:**
```tsx
import DashboardAuth from '@/middleware/dashboard-auth';

const GeneralDashboardPage = () => {
  return (
    <DashboardAuth>
      <div>This content is visible to both freelancers and clients</div>
    </DashboardAuth>
  );
};
```

## Authentication Flow

1. **Token Check**: Verifies if a valid JWT token exists in localStorage
2. **Token Decode**: Decodes the token to extract user information
3. **Account Type Check**: Verifies if user's account type matches allowed types
4. **Redirect Logic**: 
   - No token → Redirect to `/login`
   - Wrong account type → Redirect to appropriate dashboard
   - Valid access → Render protected content

## Account Type Restrictions

- **Freelancer** (`account_type: 'freelancer'`):
  - ✅ Can access `/dashboard/candidate-dashboard`
  - ❌ Cannot access `/dashboard/employ-dashboard`
  - ❌ Redirected to freelancer dashboard if trying to access client dashboard

- **Client** (`account_type: 'client'`):
  - ✅ Can access `/dashboard/employ-dashboard`
  - ❌ Cannot access `/dashboard/candidate-dashboard`
  - ❌ Redirected to client dashboard if trying to access freelancer dashboard

## Usage Examples

### Protecting a Single Route
```tsx
// pages/freelancer-only-page.tsx
import FreelancerAuth from '@/middleware/freelancer-auth';

const FreelancerOnlyPage = () => {
  return (
    <FreelancerAuth>
      <div>Freelancer-only content</div>
    </FreelancerAuth>
  );
};
```

### Protecting Multiple Routes with Custom Logic
```tsx
// pages/custom-protected-page.tsx
import AuthMiddleware from '@/middleware/auth-middleware';

const CustomProtectedPage = () => {
  return (
    <AuthMiddleware 
      allowedAccountTypes={['freelancer', 'client']}
      redirectTo="/unauthorized"
    >
      <div>Custom protected content</div>
    </AuthMiddleware>
  );
};
```

## Integration with Existing Pages

The middleware has been integrated into:
- `/dashboard/candidate-dashboard` → Uses `FreelancerAuth`
- `/dashboard/employ-dashboard` → Uses `ClientAuth`

## Error Handling

- **Invalid Token**: Automatically cleared and user redirected to login
- **Expired Token**: Automatically cleared and user redirected to login
- **Wrong Account Type**: User redirected to their appropriate dashboard
- **No Token**: User redirected to login page

## Security Features

- ✅ Token validation and expiration checking
- ✅ Automatic token cleanup on errors
- ✅ Role-based access control
- ✅ Secure redirects
- ✅ Loading states during authentication checks
- ✅ Protection against direct URL access


