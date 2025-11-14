# Registration Address & Bio Fields - Frontend Integration Guide

## Issue Summary
The fields `bio`, `address`, `state`, `city`, and `pincode` were not being saved during registration.

## ✅ Backend Fix Applied
The backend has been updated to properly accept and save these fields. The issue was:
1. **Missing DTO fields**: `city`, `state`, `pincode` were not defined in the registration DTOs
2. **Database columns**: All columns exist and are properly configured

## 📋 Address & Profile Fields for All User Types

### Video Editor Registration

#### OPTIONAL Profile Fields

| Field | Type | Max Length | Database Column | Example |
|-------|------|-----------|-----------------|---------|
| `bio` | string | TEXT | `users.bio` | `"Passionate video editor with 5+ years of experience in color correction and VFX"` |
| `address` | string | 255 chars | `users.address` | `"123 Main Street, Apt 4B"` |
| `city` | string | 100 chars | `users.city` | `"Los Angeles"` |
| `state` | string | 100 chars | `users.state` | `"California"` or `"CA"` |
| `pincode` | string | 20 chars | `users.pincode` | `"90210"` |
| `country` | string | 100 chars | `users.country` | `"USA"` or `"United States"` |
| `latitude` | number | decimal(10,8) | `users.latitude` | `34.0522` |
| `longitude` | number | decimal(11,8) | `users.longitude` | `-118.2437` |

#### Form Data Example

```javascript
const formData = new FormData();

// Basic required fields
formData.append('first_name', 'John');
formData.append('last_name', 'Doe');
formData.append('email', 'john@example.com');
formData.append('password', 'Password123!');

// Profile & Address fields (OPTIONAL but recommended)
formData.append('bio', 'Passionate video editor with 5+ years of experience in Adobe Premiere, After Effects, and DaVinci Resolve. Specialized in color correction, motion graphics, and visual effects.');
formData.append('address', '123 Main Street, Apt 4B');
formData.append('city', 'Los Angeles');
formData.append('state', 'California');
formData.append('pincode', '90210');
formData.append('country', 'USA');

// Geolocation (optional)
formData.append('latitude', '34.0522');
formData.append('longitude', '-118.2437');

// Other required fields...
formData.append('skill_tags', '["Color Correction", "VFX", "Motion Graphics"]');
formData.append('superpowers', '["Adobe Premiere Pro", "After Effects"]');
formData.append('portfolio_links', '["https://vimeo.com/portfolio"]');
formData.append('rate_amount', '120');
formData.append('phone_number', '+1234567890');
formData.append('id_type', 'passport');
formData.append('short_description', 'Expert video editor');
formData.append('availability', 'full-time');
formData.append('languages', '["English", "Spanish"]');
formData.append('terms_accepted', 'true');
formData.append('privacy_policy_accepted', 'true');

// Files
formData.append('profile_photo', profilePhotoFile);
formData.append('id_document', idDocumentFile);
```

---

### Videographer Registration

#### OPTIONAL Profile Fields

| Field | Type | Max Length | Database Column | Example |
|-------|------|-----------|-----------------|---------|
| `bio` | string | TEXT | `users.bio` | `"Professional videographer specializing in weddings and corporate events"` |
| `address` | string | 255 chars | `users.address` | `"456 Oak Avenue"` |
| `city` | string | 100 chars | `users.city` | `"New York"` |
| `state` | string | 100 chars | `users.state` | `"NY"` |
| `pincode` | string | 20 chars | `users.pincode` | `"10001"` |
| `country` | string | 100 chars | `users.country` | `"USA"` |
| `latitude` | number | decimal(10,8) | `users.latitude` | `40.7128` |
| `longitude` | number | decimal(11,8) | `users.longitude` | `-74.0060` |

**Note**: `country` is **REQUIRED** for videographers (different from video editors)

#### Form Data Example

```javascript
const formData = new FormData();

// Basic required fields
formData.append('first_name', 'Jane');
formData.append('last_name', 'Smith');
formData.append('email', 'jane@example.com');
formData.append('password', 'SecurePass456!');
formData.append('country', 'USA'); // REQUIRED for videographers

// Profile & Address fields (OPTIONAL)
formData.append('bio', 'Professional videographer with 8 years experience in wedding cinematography, corporate videos, and event coverage. Skilled in drone operation and multi-camera setups.');
formData.append('address', '456 Oak Avenue, Suite 200');
formData.append('city', 'New York');
formData.append('state', 'NY');
formData.append('pincode', '10001');

// Other required fields...
formData.append('skill_tags', '["Wedding Cinematography", "Corporate Videos"]');
formData.append('superpowers', '["Drone Operation", "Multi-camera Setup"]');
formData.append('portfolio_links', '["https://vimeo.com/jane-portfolio"]');
formData.append('rate_amount', '150');
formData.append('rate_currency', 'USD');
formData.append('phone_number', '+1234567890');
formData.append('id_type', 'driving_license');
formData.append('short_description', 'Professional wedding videographer');
formData.append('availability', 'flexible');
formData.append('languages', '["English", "French"]');
formData.append('terms_accepted', 'true');
formData.append('privacy_policy_accepted', 'true');

// Files
formData.append('profile_photo', profilePhotoFile);
formData.append('id_document', idDocumentFile);
```

---

### Client Registration

#### Profile & Address Fields

| Field | Type | Required | Database Column | Example |
|-------|------|----------|-----------------|---------|
| `address` | string | ✅ YES | `users.address` | `"789 Business Plaza, Floor 5"` |
| `city` | string | Optional | `users.city` | `"San Francisco"` |
| `state` | string | Optional | `users.state` | `"CA"` |
| `zip_code` | string | Optional | `users.pincode` | `"94102"` |
| `country` | string | ✅ YES | `users.country` | `"USA"` |

**Note**: Client registration uses `zip_code` field which maps to `users.pincode` in the database.

#### Form Data Example

```javascript
const formData = new FormData();

// Basic information
formData.append('first_name', 'Michael');
formData.append('last_name', 'Johnson');
formData.append('email', 'michael@company.com');
formData.append('password', 'ClientPass789!');

// Company information (required)
formData.append('company_name', 'Johnson Productions');
formData.append('industry', 'film');
formData.append('company_size', '11-50');

// Address information
formData.append('address', '789 Business Plaza, Floor 5'); // REQUIRED
formData.append('city', 'San Francisco');
formData.append('state', 'CA');
formData.append('zip_code', '94102'); // Maps to pincode
formData.append('country', 'USA'); // REQUIRED

// Other fields...
formData.append('phone_number', '+1234567890');
formData.append('terms_accepted', 'true');
formData.append('privacy_policy_accepted', 'true');
```

---

## 🔍 Backend Validation & Processing

### Field Validation in DTOs

All address and bio fields are marked as **OPTIONAL** (`@IsOptional()`) in the registration DTOs, meaning:
- ✅ They can be omitted from the request
- ✅ They can be sent as empty strings
- ✅ They will be saved as `null` in the database if not provided

### Database Storage

```sql
-- Users table columns
bio          TEXT           NULL
address      VARCHAR(255)   NULL
city         VARCHAR(100)   NULL
state        VARCHAR(100)   NULL
pincode      VARCHAR(20)    NULL
country      VARCHAR(100)   NULL
latitude     DECIMAL(10,8)  NULL
longitude    DECIMAL(11,8)  NULL
```

### Backend Processing Logic

The backend service handles these fields as follows:

```typescript
// For Video Editor & Videographer
{
  bio: data.bio || null,
  address: data.address || data.street_address, // Fallback for legacy field name
  city: data.city,
  state: data.state || null,
  country: data.country,
  pincode: data.pincode || null,
  latitude: data.latitude || null,
  longitude: data.longitude || null,
}

// For Client
{
  address: data.address,
  city: data.city,
  state: data.state,
  country: data.country,
  pincode: data.zip_code || data.pincode || null, // Supports both field names
  latitude: data.latitude || null,
  longitude: data.longitude || null,
}
```

---

## 🐛 Debugging Guide

### Backend Logs

The backend now logs address-related fields for debugging:

```
🔍 Video Editor Registration - Received data: {
  bio: 'Passionate video editor...',
  address: '123 Main Street',
  state: 'CA',
  pincode: '90210',
  city: 'Los Angeles',
  country: 'USA'
}
```

### Common Issues

#### ❌ Fields are empty strings instead of being sent
**Problem**: Frontend sends empty strings `""` instead of omitting the field
```javascript
// ❌ Wrong
formData.append('bio', '');
formData.append('address', '');

// ✅ Correct - don't append if empty
if (bioValue && bioValue.trim()) {
  formData.append('bio', bioValue);
}
```

#### ❌ Fields not being sent at all
**Problem**: Form data not including optional fields
```javascript
// ✅ Solution - always send optional fields if you have the data
formData.append('bio', userData.bio || '');
formData.append('address', userData.address || '');
formData.append('city', userData.city || '');
formData.append('state', userData.state || '');
formData.append('pincode', userData.pincode || '');
```

#### ❌ Using wrong field names
**Problem**: Frontend using different field names
```javascript
// ❌ Wrong field names
formData.append('biography', 'text'); // Should be 'bio'
formData.append('location', 'address'); // Should be 'address'
formData.append('postal_code', '12345'); // Should be 'pincode' or 'zip_code'

// ✅ Correct field names
formData.append('bio', 'text');
formData.append('address', 'address');
formData.append('pincode', '12345');
```

---

## 🧪 Testing Checklist

### For Video Editor Registration:

- [ ] Send `bio` field with text content
- [ ] Send `address` field with street address
- [ ] Send `city` field
- [ ] Send `state` field
- [ ] Send `pincode` field
- [ ] Send `country` field
- [ ] Verify all fields saved in database
- [ ] Check backend logs for received data

### For Videographer Registration:

- [ ] Send `bio` field with text content
- [ ] Send `address` field with street address
- [ ] Send `city` field
- [ ] Send `state` field
- [ ] Send `pincode` field
- [ ] Send **required** `country` field
- [ ] Verify all fields saved in database
- [ ] Check backend logs for received data

### For Client Registration:

- [ ] Send **required** `address` field
- [ ] Send optional `city` field
- [ ] Send optional `state` field
- [ ] Send optional `zip_code` field (maps to pincode)
- [ ] Send **required** `country` field
- [ ] Verify all fields saved in database

---

## 📊 API Response

After successful registration, the user data is stored and can be retrieved via profile endpoints. The address fields will be populated:

```json
{
  "user_id": 123,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "bio": "Passionate video editor...",
  "address": "123 Main Street, Apt 4B",
  "city": "Los Angeles",
  "state": "California",
  "pincode": "90210",
  "country": "USA",
  "latitude": 34.0522,
  "longitude": -118.2437
}
```

---

## 🔗 Related Endpoints

- `POST /api/v1/auth/register/videoeditor` - Video editor registration
- `POST /api/v1/auth/register/videographer` - Videographer registration
- `POST /api/v1/auth/register/client` - Client registration
- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/:id` - Update user profile

---

## 🆘 Support

If fields are still not being saved:

1. **Check backend logs** for the debug output showing received data
2. **Verify field names** match exactly (case-sensitive)
3. **Inspect network request** in browser DevTools to see what's being sent
4. **Check database** directly to verify if data was saved
5. **Review validation errors** in the API response

### Database Query to Check Saved Data

```sql
SELECT user_id, email, bio, address, city, state, pincode, country 
FROM users 
WHERE email = 'your-test-email@example.com';
```
