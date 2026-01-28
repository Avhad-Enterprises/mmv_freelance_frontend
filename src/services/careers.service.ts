import { Career, CareersResponse } from "@/types/career.types";
import { useState, useEffect } from "react";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1`;

/**
 * Fetch all active careers
 * Endpoint: GET /careers
 */
export const fetchCareers = async (): Promise<Career[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/careers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            // If 404, return empty array as the endpoint might not exist yet
            if (response.status === 404) return [];
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const result: CareersResponse = await response.json();

        // The API might return { data: [...] } or just [...] depend on backend implementation
        // Based on admin api.ts, it returns { data: Career[] }
        // But let's handle the response structure safely
        if (result.data) {
            return result.data.filter(job => job.is_active);
        }

        return [];
    } catch (error) {
        console.error("Error fetching careers:", error);
        return []; // Return empty array on error to prevent page crash
    }
};

/**
 * Fetch single career by ID
 * Endpoint: GET /careers/:id
 */
export const fetchCareerById = async (id: number): Promise<Career | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/careers/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            return null;
        }

        const result: { data: Career } = await response.json();
        return result.data;
    } catch (error) {
        console.error(`Error fetching career ${id}:`, error);
        return null;
    }
};

/**
 * React hook to fetch careers with loading and error states
 */
export const useCareers = () => {
    const [data, setData] = useState<Career[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadCareers = async () => {
            try {
                setIsLoading(true);
                const careers = await fetchCareers();
                setData(careers);
                setError(null);
            } catch (err) {
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        };

        loadCareers();
    }, []);

    return { data, isLoading, error };
};
