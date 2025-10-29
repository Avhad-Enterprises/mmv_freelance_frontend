# User Profile Update APIs Documentation

This document provides comprehensive information about all user profile update endpoints in the MMV Freelance API. The API follows a separation of concerns architecture where different endpoints update different database tables.

## Overview

The API provides 4 distinct update endpoints, each responsible for updating specific aspects of user profiles:

1. **User Basic Info** (`/users/me`) - Updates core user account information
2. **Client Profile** (`/clients/profile`) - Updates client-specific business information
3. **Videographer Profile** (`/videographers/profile`) - Updates videographer professional information
4. **Video Editor Profile** (`/videoeditors/profile`) - Updates video editor professional information

## Authentication

All endpoints require JWT authentication in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 1. Update User Basic Information

**Endpoint:** `PATCH /api/v1/users/me`

**Required Roles:** Any authenticated user

**Description:** Updates basic user account information stored in the `users` table. This includes identity, contact details, and general profile information.

### Request Body (All fields optional)
```json
{
  // Identity
  "first_name": "string",
  "last_name": "string",
  "username": "string",
  "email": "string",

  // Contact
  "phone_number": "string",
  "phone_verified": "boolean",
  "email_verified": "boolean",

  // Profile
  "profile_picture": "string (URL)",
  "bio": "string",
  "timezone": "string",

  // Address
  "address_line_first": "string",
  "address_line_second": "string",
  "city": "string",
  "state": "string",
  "country": "string",
  "pincode": "string",

  // Notifications
  "email_notifications": "boolean"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "user_id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "phone_number": "+1234567890",
      "phone_verified": true,
      "email_verified": true,
      "profile_picture": "https://example.com/avatar.jpg",
      "bio": "Professional user",
      "timezone": "UTC",
      "address_line_first": "123 Main St",
      "address_line_second": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "pincode": "10001",
      "email_notifications": true,
      "updated_at": "2025-10-20T10:00:00Z"
    }
  },
  "meta": {
    "timestamp": "2025-10-20T10:00:00Z",
    "version": "v1"
  }
}
```
## 4. Update Video Editor Profile

**Endpoint:** `PATCH /api/v1/videoeditors/profile`

**Required Roles:** VIDEO_EDITOR

**Description:** Updates video editor-specific profile information stored in the `freelancer_profiles` table. This includes professional details, editing skills, pricing, and portfolio information.

### Request Body (All fields optional)
```json
{
  // Professional Info
  "profile_title": "string",
  "role": "string",
  "short_description": "string",
  "experience_level": "entry | intermediate | expert | master",

  // Skills & Expertise
  "skills": "string[]",
  "superpowers": "string[]",
  "skill_tags": "string[]",
  "base_skills": "string[]",
  "languages": "string[]",

  // Portfolio & Credentials
  "portfolio_links": "string[]",
  "certification": "object",
  "education": "object",
  "previous_works": "object",
  "services": "object",

  // Pricing & Availability
  "rate_amount": "number (minimum: 0)",
  "currency": "string",
  "availability": "string",
  "work_type": "string",
  "hours_per_week": "string",

  // Verification
  "id_type": "string",
  "id_document_url": "string",
  "kyc_verified": "boolean",
  "aadhaar_verification": "boolean",

  // Payment
  "payment_method": "object",
  "bank_account_info": "object"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "user_id": 4,
      "first_name": "Sarah",
      "last_name": "Davis",
      "username": "sarahdavis",
      "email": "sarah@example.com",
      "company_name": "SD Video Editing",
      "profile_title": "Senior Video Editor",
      "role": "Lead Editor",
      "short_description": "Award-winning video editor specializing in corporate content",
      "experience_level": "expert",
      "skills": ["video_editing", "color_grading", "motion_graphics"],
      "superpowers": ["creative editing", "technical expertise"],
      "portfolio_links": ["https://behance.net/sarah-davis"],
      "rate_amount": 95.00,
      "currency": "USD",
      "availability": "full-time",
      "languages": ["English", "French"],
      "updated_at": "2025-10-20T10:00:00Z"
    }
  },
  "meta": {
    "timestamp": "2025-10-20T10:00:00Z",
    "version": "v1"
  }
}
```

---

## Error Responses

All endpoints return standardized error responses:

### 400 Bad Request (Validation Error)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "email must be a valid email address"
    },
    {
      "field": "rate_amount",
      "message": "rate_amount must be a positive number"
    }
  ],
  "meta": {
    "timestamp": "2025-10-20T10:00:00Z",
    "version": "v1"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication token missing",
  "meta": {
    "timestamp": "2025-10-20T10:00:00Z",
    "version": "v1"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions",
  "meta": {
    "timestamp": "2025-10-20T10:00:00Z",
    "version": "v1"
  }
}
```

---

## Validation Rules

### Common Validation Rules
- **All fields are optional** - Only provided fields will be updated
- **String fields** - Must be non-empty strings when provided
- **Email fields** - Must be valid email format
- **URL fields** - Must be valid URLs
- **Number fields** - Must be valid numbers, with minimum constraints where specified
- **Array fields** - Must be arrays or JSON-parseable strings
- **Boolean fields** - Must be true/false values
- **Enum fields** - Must match one of the allowed values

### Field-Specific Validation
- `rate_amount`: Must be ≥ 0
- `budget_min`, `budget_max`: Must be ≥ 0
- `email`: Must be valid email format
- `profile_picture`, `website`: Must be valid URLs
- `phone_number`: String format (no specific validation)

---