import { useState, useEffect } from "react";
import {
  LandingPageContent,
  HeroSection,
  TrustedCompany,
  WhyChooseUs,
  FeaturedCreator,
  SuccessStory,
  LandingFaq,
} from "@/types/cms.types";
import {
  fetchLandingPageContent,
  fetchHeroSection,
  fetchTrustedCompanies,
  fetchWhyChooseUs,
  fetchFeaturedCreators,
  fetchSuccessStories,
  fetchLandingFaqs,
} from "@/services/cms.service";

interface UseCmsDataState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Main hook to fetch all landing page content in a single API call
 */
export const useLandingPageContent =
  (): UseCmsDataState<LandingPageContent> => {
    const [data, setData] = useState<LandingPageContent | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchLandingPageContent();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch landing page content")
        );
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      loadData();
    }, []);

    return {
      data,
      isLoading,
      error,
      refetch: loadData,
    };
  };

/**
 * Hook to fetch hero section data
 */
export const useHeroSection = (): UseCmsDataState<HeroSection[]> => {
  const [data, setData] = useState<HeroSection[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchHeroSection();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch hero section")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: loadData,
  };
};

/**
 * Hook to fetch trusted companies data
 */
export const useTrustedCompanies = (): UseCmsDataState<TrustedCompany[]> => {
  const [data, setData] = useState<TrustedCompany[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchTrustedCompanies();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch trusted companies")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: loadData,
  };
};

/**
 * Hook to fetch why choose us data
 */
export const useWhyChooseUs = (): UseCmsDataState<WhyChooseUs[]> => {
  const [data, setData] = useState<WhyChooseUs[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchWhyChooseUs();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch why choose us")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: loadData,
  };
};

/**
 * Hook to fetch featured creators data
 */
export const useFeaturedCreators = (): UseCmsDataState<FeaturedCreator[]> => {
  const [data, setData] = useState<FeaturedCreator[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchFeaturedCreators();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch featured creators")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: loadData,
  };
};

/**
 * Hook to fetch success stories data
 */
export const useSuccessStories = (): UseCmsDataState<SuccessStory[]> => {
  const [data, setData] = useState<SuccessStory[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchSuccessStories();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch success stories")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: loadData,
  };
};

/**
 * Hook to fetch landing FAQs data
 */
export const useLandingFaqs = (): UseCmsDataState<LandingFaq[]> => {
  const [data, setData] = useState<LandingFaq[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchLandingFaqs();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch landing FAQs")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: loadData,
  };
};
