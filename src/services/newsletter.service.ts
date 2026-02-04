import { useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1`;

export interface NewsletterSubscription {
  id: number;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

export interface SubscribeResponse {
  data: NewsletterSubscription;
  message: string;
}

/**
 * Subscribe email to newsletter
 * Endpoint: POST /subscribed/insert
 */
export const subscribeToNewsletter = async (
  email: string,
): Promise<SubscribeResponse> => {
  const response = await fetch(`${API_BASE_URL}/subscribed/insert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Subscription failed: ${response.status}`,
    );
  }

  return response.json();
};

/**
 * React hook for newsletter subscription with loading and status states
 */
export const useNewsletterSubscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const subscribe = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await subscribeToNewsletter(email);
      setSuccess(true);
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to subscribe";
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return { subscribe, isLoading, error, success, reset };
};
