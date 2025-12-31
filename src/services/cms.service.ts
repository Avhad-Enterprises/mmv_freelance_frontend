import {
  CMSResponse,
  LandingPageContent,
  HeroSection,
  TrustedCompany,
  WhyChooseUs,
  FeaturedCreator,
  SuccessStory,
  LandingFaq,
} from "@/types/cms.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
const CMS_BASE_PATH = "/cms-landing";

/**
 * Fetch complete landing page content in a single API call
 * Endpoint: GET /cms-landing/public
 */
export const fetchLandingPageContent =
  async (): Promise<LandingPageContent> => {
    try {
      const response = await fetch(`${API_BASE_URL}${CMS_BASE_PATH}/public`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Disable caching for fresh data
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result: CMSResponse<LandingPageContent> = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || "Failed to fetch landing page content"
        );
      }

      return result.data;
    } catch (error) {
      console.error("Error fetching landing page content:", error);
      throw error;
    }
  };

/**
 * Fetch hero section data
 * Endpoint: GET /cms-landing/public/hero
 */
export const fetchHeroSection = async (): Promise<HeroSection[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${CMS_BASE_PATH}/public/hero`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result: CMSResponse<HeroSection[]> = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch hero section");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching hero section:", error);
    throw error;
  }
};

/**
 * Fetch trusted companies data
 * Endpoint: GET /cms-landing/public/trusted-companies
 */
export const fetchTrustedCompanies = async (): Promise<TrustedCompany[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${CMS_BASE_PATH}/public/trusted-companies`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result: CMSResponse<TrustedCompany[]> = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch trusted companies");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching trusted companies:", error);
    throw error;
  }
};

/**
 * Fetch why choose us data
 * Endpoint: GET /cms-landing/public/why-choose-us
 */
export const fetchWhyChooseUs = async (): Promise<WhyChooseUs[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${CMS_BASE_PATH}/public/why-choose-us`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result: CMSResponse<WhyChooseUs[]> = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch why choose us");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching why choose us:", error);
    throw error;
  }
};

/**
 * Fetch featured creators data
 * Endpoint: GET /cms-landing/public/featured-creators
 */
export const fetchFeaturedCreators = async (): Promise<FeaturedCreator[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${CMS_BASE_PATH}/public/featured-creators`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result: CMSResponse<FeaturedCreator[]> = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch featured creators");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching featured creators:", error);
    throw error;
  }
};

/**
 * Fetch success stories data
 * Endpoint: GET /cms-landing/public/success-stories
 */
export const fetchSuccessStories = async (): Promise<SuccessStory[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${CMS_BASE_PATH}/public/success-stories`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result: CMSResponse<SuccessStory[]> = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch success stories");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching success stories:", error);
    throw error;
  }
};

/**
 * Fetch landing FAQs data
 * Endpoint: GET /cms-landing/public/faqs
 */
export const fetchLandingFaqs = async (): Promise<LandingFaq[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}${CMS_BASE_PATH}/public/faqs`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result: CMSResponse<LandingFaq[]> = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch landing FAQs");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching landing FAQs:", error);
    throw error;
  }
};
