# CMS Integration Implementation Plan

## Overview

This document provides comprehensive guidance for integrating the CMS API endpoints with the frontend landing page. The CMS backend exposes public endpoints that return active content for all landing page sections. When administrators update content in the admin panel, the changes will automatically reflect on the landing page through these endpoints.

---

## Base Configuration

### API Base URL
```typescript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const CMS_BASE_PATH = '/api/cms-landing';
```

---

## Public API Endpoints (For Landing Page)

These endpoints are publicly accessible (no authentication required) and return only **active** CMS content. They are rate-limited for protection.

### 1. Get Complete Landing Page Content

**Endpoint:** `GET /api/cms-landing/public`

**Description:** Returns all active landing page sections in a single API call (recommended for performance).

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "hero": [...],
    "trusted_companies": [...],
    "why_choose_us": [...],
    "featured_creators": [...],
    "success_stories": [...],
    "landing_faqs": [...]
  },
  "message": "Landing page content retrieved successfully"
}
```

**Usage Example:**
```typescript
const fetchLandingPageContent = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}${CMS_BASE_PATH}/public`);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    }
  } catch (error) {
    console.error('Error fetching landing page content:', error);
  }
};
```

---

### 2. Get Active Hero Section

**Endpoint:** `GET /api/cms-landing/public/hero`

**Description:** Returns active hero section(s) only.

**Response Data Structure:**
```typescript
interface HeroSection {
  cms_id: number;
  section_type: 'hero';
  title: string;
  subtitle?: string;
  hero_left_image?: string;   // URL to left illustration
  hero_right_image?: string;  // URL to right illustration
  background_image?: string;  // Legacy field
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
```

**Usage Example:**
```typescript
const fetchHeroSection = async () => {
  const response = await fetch(`${API_BASE_URL}${CMS_BASE_PATH}/public/hero`);
  const result = await response.json();
  return result.data; // Array of active hero sections
};
```

**Frontend Implementation (React):**
```tsx
const HeroSection = () => {
  const [heroData, setHeroData] = useState<HeroSection[]>([]);

  useEffect(() => {
    const loadHero = async () => {
      const data = await fetchHeroSection();
      setHeroData(data);
    };
    loadHero();
  }, []);

  if (!heroData.length) return null;
  
  const hero = heroData[0]; // Typically one hero section

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>{hero.title}</h1>
        {hero.subtitle && <p>{hero.subtitle}</p>}
      </div>
      <div className="hero-images">
        {hero.hero_left_image && (
          <img src={hero.hero_left_image} alt="Hero Left" />
        )}
        {hero.hero_right_image && (
          <img src={hero.hero_right_image} alt="Hero Right" />
        )}
      </div>
    </section>
  );
};
```

---

### 3. Get Active Trusted Companies

**Endpoint:** `GET /api/cms-landing/public/trusted-companies`

**Description:** Returns active trusted company logos and information.

**Response Data Structure:**
```typescript
interface TrustedCompany {
  cms_id: number;
  section_type: 'trusted_company';
  company_name: string;
  logo_url: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
```

**Usage Example:**
```typescript
const fetchTrustedCompanies = async () => {
  const response = await fetch(`${API_BASE_URL}${CMS_BASE_PATH}/public/trusted-companies`);
  const result = await response.json();
  return result.data; // Sorted by sort_order
};
```

**Frontend Implementation:**
```tsx
const TrustedCompanies = () => {
  const [companies, setCompanies] = useState<TrustedCompany[]>([]);

  useEffect(() => {
    const loadCompanies = async () => {
      const data = await fetchTrustedCompanies();
      setCompanies(data);
    };
    loadCompanies();
  }, []);

  return (
    <section className="trusted-companies">
      <h2>Trusted by Leading Companies</h2>
      <div className="company-logos">
        {companies.map((company) => (
          <div key={company.cms_id} className="company-item">
            <img 
              src={company.logo_url} 
              alt={company.company_name}
              title={company.company_name}
            />
            {company.description && <p>{company.description}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};
```

---

### 4. Get Active Why Choose Us

**Endpoint:** `GET /api/cms-landing/public/why-choose-us`

**Description:** Returns active "Why Choose Us" items with structured points.

**Response Data Structure:**
```typescript
interface WhyChooseUs {
  cms_id: number;
  section_type: 'why_choose_us';
  title: string;
  description?: string;
  point_1?: string;
  point_1_description?: string;
  point_2?: string;
  point_2_description?: string;
  point_3?: string;
  point_3_description?: string;
  point_4?: string;
  point_4_description?: string;
  point_5?: string;
  point_5_description?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
```

**Usage Example:**
```typescript
const fetchWhyChooseUs = async () => {
  const response = await fetch(`${API_BASE_URL}${CMS_BASE_PATH}/public/why-choose-us`);
  const result = await response.json();
  return result.data;
};
```

**Frontend Implementation:**
```tsx
const WhyChooseUsSection = () => {
  const [items, setItems] = useState<WhyChooseUs[]>([]);

  useEffect(() => {
    const loadItems = async () => {
      const data = await fetchWhyChooseUs();
      setItems(data);
    };
    loadItems();
  }, []);

  if (!items.length) return null;

  const item = items[0]; // Typically one item

  // Extract points into an array for easier rendering
  const points = [
    { title: item.point_1, description: item.point_1_description },
    { title: item.point_2, description: item.point_2_description },
    { title: item.point_3, description: item.point_3_description },
    { title: item.point_4, description: item.point_4_description },
    { title: item.point_5, description: item.point_5_description },
  ].filter(p => p.title); // Filter out empty points

  return (
    <section className="why-choose-us">
      <h2>{item.title}</h2>
      {item.description && <p>{item.description}</p>}
      <div className="points-grid">
        {points.map((point, index) => (
          <div key={index} className="point-card">
            <h3>{point.title}</h3>
            <p>{point.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
```

---

### 5. Get Active Featured Creators

**Endpoint:** `GET /api/cms-landing/public/featured-creators`

**Description:** Returns active featured creator profiles.

**Response Data Structure:**
```typescript
interface FeaturedCreator {
  cms_id: number;
  section_type: 'featured_creator';
  name: string;
  title?: string;
  bio?: string;
  profile_image?: string;
  skills?: string[];
  stats?: Record<string, any>;
  portfolio_url?: string;
  social_linkedin?: string;
  social_twitter?: string;
  social_instagram?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
```

**Usage Example:**
```typescript
const fetchFeaturedCreators = async () => {
  const response = await fetch(`${API_BASE_URL}${CMS_BASE_PATH}/public/featured-creators`);
  const result = await response.json();
  return result.data;
};
```

**Frontend Implementation:**
```tsx
const FeaturedCreators = () => {
  const [creators, setCreators] = useState<FeaturedCreator[]>([]);

  useEffect(() => {
    const loadCreators = async () => {
      const data = await fetchFeaturedCreators();
      setCreators(data);
    };
    loadCreators();
  }, []);

  return (
    <section className="featured-creators">
      <h2>Featured Creators</h2>
      <div className="creators-grid">
        {creators.map((creator) => (
          <div key={creator.cms_id} className="creator-card">
            {creator.profile_image && (
              <img src={creator.profile_image} alt={creator.name} />
            )}
            <h3>{creator.name}</h3>
            {creator.title && <p className="title">{creator.title}</p>}
            {creator.bio && <p className="bio">{creator.bio}</p>}
            
            {creator.skills && creator.skills.length > 0 && (
              <div className="skills">
                {creator.skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">{skill}</span>
                ))}
              </div>
            )}
            
            {creator.stats && (
              <div className="stats">
                {Object.entries(creator.stats).map(([key, value]) => (
                  <div key={key} className="stat">
                    <span className="value">{value}</span>
                    <span className="label">{key}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="social-links">
              {creator.portfolio_url && (
                <a href={creator.portfolio_url} target="_blank" rel="noopener noreferrer">
                  Portfolio
                </a>
              )}
              {creator.social_linkedin && (
                <a href={creator.social_linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
              {creator.social_twitter && (
                <a href={creator.social_twitter} target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
```

---

### 6. Get Active Success Stories

**Endpoint:** `GET /api/cms-landing/public/success-stories`

**Description:** Returns active client testimonials and success stories.

**Response Data Structure:**
```typescript
interface SuccessStory {
  cms_id: number;
  section_type: 'success_story';
  client_name: string;
  title?: string;
  client_title?: string;
  client_image?: string;
  testimonial: string;
  rating?: number; // 1-5
  company?: string;
  company_logo?: string;
  project_type?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
```

**Usage Example:**
```typescript
const fetchSuccessStories = async () => {
  const response = await fetch(`${API_BASE_URL}${CMS_BASE_PATH}/public/success-stories`);
  const result = await response.json();
  return result.data;
};
```

**Frontend Implementation:**
```tsx
const SuccessStories = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);

  useEffect(() => {
    const loadStories = async () => {
      const data = await fetchSuccessStories();
      setStories(data);
    };
    loadStories();
  }, []);

  return (
    <section className="success-stories">
      <h2>Success Stories</h2>
      <div className="stories-carousel">
        {stories.map((story) => (
          <div key={story.cms_id} className="story-card">
            <div className="story-header">
              {story.client_image && (
                <img src={story.client_image} alt={story.client_name} />
              )}
              <div className="client-info">
                <h3>{story.client_name}</h3>
                {story.client_title && <p>{story.client_title}</p>}
                {story.company && <p className="company">{story.company}</p>}
              </div>
              {story.company_logo && (
                <img src={story.company_logo} alt={story.company} className="company-logo" />
              )}
            </div>
            
            {story.rating && (
              <div className="rating">
                {'★'.repeat(story.rating)}{'☆'.repeat(5 - story.rating)}
              </div>
            )}
            
            <p className="testimonial">{story.testimonial}</p>
            
            {story.project_type && (
              <span className="project-type">{story.project_type}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
```

---

### 7. Get Active Landing FAQs

**Endpoint:** `GET /api/cms-landing/public/faqs`

**Description:** Returns active frequently asked questions for the landing page.

**Response Data Structure:**
```typescript
interface LandingFaq {
  cms_id: number;
  section_type: 'landing_faq';
  question: string;
  answer: string;
  title?: string;
  category?: string;
  tags?: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
```

**Usage Example:**
```typescript
const fetchLandingFaqs = async () => {
  const response = await fetch(`${API_BASE_URL}${CMS_BASE_PATH}/public/faqs`);
  const result = await response.json();
  return result.data;
};
```

**Frontend Implementation:**
```tsx
const FAQSection = () => {
  const [faqs, setFaqs] = useState<LandingFaq[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const loadFaqs = async () => {
      const data = await fetchLandingFaqs();
      setFaqs(data);
    };
    loadFaqs();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Group by category if needed
  const groupedFaqs = faqs.reduce((acc, faq) => {
    const category = faq.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, LandingFaq[]>);

  return (
    <section className="faq-section">
      <h2>Frequently Asked Questions</h2>
      {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
        <div key={category} className="faq-category">
          <h3>{category}</h3>
          <div className="faq-list">
            {categoryFaqs.map((faq, index) => (
              <div key={faq.cms_id} className="faq-item">
                <button 
                  className="faq-question" 
                  onClick={() => toggleFaq(index)}
                >
                  {faq.question}
                  <span className={openIndex === index ? 'open' : 'closed'}>
                    {openIndex === index ? '−' : '+'}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};
```

---

## Advanced Integration Patterns

### Using React Query for Caching

React Query provides automatic caching, background refetching, and state management.

**Installation:**
```bash
npm install @tanstack/react-query
```

**Setup:**
```tsx
// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}
```

**Custom Hook Example:**
```tsx
// hooks/useCmsData.ts
import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const CMS_BASE_PATH = '/api/cms-landing';

export const useLandingPageContent = () => {
  return useQuery({
    queryKey: ['landing-page-content'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}${CMS_BASE_PATH}/public`);
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });
};

export const useHeroSection = () => {
  return useQuery({
    queryKey: ['hero-section'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}${CMS_BASE_PATH}/public/hero`);
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });
};

export const useTrustedCompanies = () => {
  return useQuery({
    queryKey: ['trusted-companies'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}${CMS_BASE_PATH}/public/trusted-companies`);
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
  });
};

// ... similar hooks for other sections
```

**Usage in Components:**
```tsx
const LandingPage = () => {
  const { data: content, isLoading, error } = useLandingPageContent();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="landing-page">
      <HeroSection data={content.hero} />
      <TrustedCompanies data={content.trusted_companies} />
      <WhyChooseUs data={content.why_choose_us} />
      <FeaturedCreators data={content.featured_creators} />
      <SuccessStories data={content.success_stories} />
      <FAQSection data={content.landing_faqs} />
    </div>
  );
};
```

---

### Using SWR for Data Fetching

SWR is another popular alternative with similar functionality.

**Installation:**
```bash
npm install swr
```

**Custom Hook Example:**
```tsx
// hooks/useCmsData.ts
import useSWR from 'swr';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const CMS_BASE_PATH = '/api/cms-landing';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const result = await response.json();
  if (!result.success) throw new Error(result.message);
  return result.data;
};

export const useLandingPageContent = () => {
  return useSWR(`${API_BASE_URL}${CMS_BASE_PATH}/public`, fetcher);
};

export const useHeroSection = () => {
  return useSWR(`${API_BASE_URL}${CMS_BASE_PATH}/public/hero`, fetcher);
};

// ... similar hooks for other sections
```

**Usage:**
```tsx
const HeroSection = () => {
  const { data, error, isLoading } = useHeroSection();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data || !data.length) return null;

  const hero = data[0];

  return (
    <section className="hero">
      <h1>{hero.title}</h1>
      {hero.subtitle && <p>{hero.subtitle}</p>}
    </section>
  );
};
```

---

## Error Handling Best Practices

### 1. Network Error Handling
```typescript
const fetchWithErrorHandling = async (url: string) => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch data');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching CMS data:', error);
    
    // Fallback to cached data or return empty array
    return [];
  }
};
```

### 2. Loading States
```tsx
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Loading content...</p>
  </div>
);
```

### 3. Error Boundaries
```tsx
class CMSErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong loading the content.</h2>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## Performance Optimization

### 1. Image Lazy Loading
```tsx
<img 
  src={company.logo_url} 
  alt={company.company_name}
  loading="lazy"
  decoding="async"
/>
```

### 2. Prefetching Data
```tsx
// Prefetch on page load
useEffect(() => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = `${API_BASE_URL}${CMS_BASE_PATH}/public`;
  document.head.appendChild(link);
}, []);
```

### 3. Memoization
```tsx
const MemoizedCreatorCard = React.memo(({ creator }: { creator: FeaturedCreator }) => (
  <div className="creator-card">
    {/* card content */}
  </div>
));
```

---

## Real-time Updates (Optional)

For real-time updates when CMS content changes, implement Server-Sent Events (SSE) or WebSocket connections.

**Example with Polling:**
```tsx
const useLiveContent = (refreshInterval = 60000) => {
  const { data, mutate } = useSWR(
    `${API_BASE_URL}${CMS_BASE_PATH}/public`,
    fetcher,
    { refreshInterval } // Refetch every 60 seconds
  );

  return { data, refresh: mutate };
};
```

---

## Testing API Endpoints

### Using cURL
```bash
# Get all landing page content
curl http://localhost:5000/api/cms-landing/public

# Get hero section
curl http://localhost:5000/api/cms-landing/public/hero

# Get trusted companies
curl http://localhost:5000/api/cms-landing/public/trusted-companies

# Get why choose us
curl http://localhost:5000/api/cms-landing/public/why-choose-us

# Get featured creators
curl http://localhost:5000/api/cms-landing/public/featured-creators

# Get success stories
curl http://localhost:5000/api/cms-landing/public/success-stories

# Get FAQs
curl http://localhost:5000/api/cms-landing/public/faqs
```

### Using Postman/Insomnia
1. Create a new GET request
2. Set the URL to `http://your-api-domain/api/cms-landing/public`
3. Send the request
4. Verify the response structure matches the documented format

---

## TypeScript Type Definitions

Create a central types file for all CMS data structures:

```typescript
// types/cms.ts

export interface CMSResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface HeroSection {
  cms_id: number;
  section_type: 'hero';
  title: string;
  subtitle?: string;
  hero_left_image?: string;
  hero_right_image?: string;
  background_image?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TrustedCompany {
  cms_id: number;
  section_type: 'trusted_company';
  company_name: string;
  logo_url: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface WhyChooseUs {
  cms_id: number;
  section_type: 'why_choose_us';
  title: string;
  description?: string;
  point_1?: string;
  point_1_description?: string;
  point_2?: string;
  point_2_description?: string;
  point_3?: string;
  point_3_description?: string;
  point_4?: string;
  point_4_description?: string;
  point_5?: string;
  point_5_description?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FeaturedCreator {
  cms_id: number;
  section_type: 'featured_creator';
  name: string;
  title?: string;
  bio?: string;
  profile_image?: string;
  skills?: string[];
  stats?: Record<string, any>;
  portfolio_url?: string;
  social_linkedin?: string;
  social_twitter?: string;
  social_instagram?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SuccessStory {
  cms_id: number;
  section_type: 'success_story';
  client_name: string;
  title?: string;
  client_title?: string;
  client_image?: string;
  testimonial: string;
  rating?: number;
  company?: string;
  company_logo?: string;
  project_type?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface LandingFaq {
  cms_id: number;
  section_type: 'landing_faq';
  question: string;
  answer: string;
  title?: string;
  category?: string;
  tags?: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface LandingPageContent {
  hero: HeroSection[];
  trusted_companies: TrustedCompany[];
  why_choose_us: WhyChooseUs[];
  featured_creators: FeaturedCreator[];
  success_stories: SuccessStory[];
  landing_faqs: LandingFaq[];
}
```

---

## Summary

### Quick Start Checklist

- [ ] Set up environment variable `REACT_APP_API_BASE_URL`
- [ ] Install data fetching library (React Query or SWR recommended)
- [ ] Create TypeScript type definitions
- [ ] Create custom hooks for each CMS section
- [ ] Implement loading and error states
- [ ] Build UI components using the fetched data
- [ ] Test with the backend API
- [ ] Optimize images with lazy loading
- [ ] Implement error boundaries
- [ ] Add monitoring/analytics for API calls

### Recommended Approach

**Option 1 (Recommended):** Use the single comprehensive endpoint
```typescript
GET /api/cms-landing/public
```
This fetches all sections in one API call, reducing network overhead.

**Option 2:** Fetch sections individually
Useful if you're lazy-loading sections or implementing infinite scroll.

### Key Points

1. **All endpoints are public** - No authentication required
2. **Rate limited** - Respect rate limits to avoid throttling
3. **Returns only active content** - Inactive content is automatically filtered
4. **Sorted automatically** - Content is returned in `sort_order`
5. **Real-time reflection** - Changes in admin panel immediately reflect after refetching

### Support

For questions or issues:
- Check API response structure matches documentation
- Verify backend is running and accessible
- Check browser console for CORS errors
- Ensure environment variables are set correctly
