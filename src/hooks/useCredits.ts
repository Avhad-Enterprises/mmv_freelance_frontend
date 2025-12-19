/**
 * useCredits Hook
 * @module hooks/useCredits
 *
 * Custom hook for managing credit balance and packages state
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { creditsService } from "@/services/credits.service";
import {
    CreditBalance,
    PackagesResponse,
    CreditTransaction,
    Pagination,
    HistoryParams,
} from "@/types/credits";
import toast from "react-hot-toast";

interface UseCreditsReturn {
    // State
    balance: CreditBalance | null;
    packages: PackagesResponse | null;
    loading: boolean;
    error: string | null;

    // Actions
    refreshBalance: () => Promise<void>;
    refreshPackages: () => Promise<void>;
    refresh: () => Promise<void>;

    // Computed
    hasCredits: boolean;
    canApply: boolean;
}

interface UseCreditsHistoryReturn {
    transactions: CreditTransaction[];
    pagination: Pagination | null;
    loading: boolean;
    error: string | null;
    fetchHistory: (params?: HistoryParams) => Promise<void>;
    setPage: (page: number) => void;
    setFilter: (type: string) => void;
    refetch: () => Promise<void>; // Force refresh the history
}

/**
 * Hook for managing credit balance and packages
 */
export function useCredits(): UseCreditsReturn {
    const [balance, setBalance] = useState<CreditBalance | null>(null);
    const [packages, setPackages] = useState<PackagesResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBalance = useCallback(async () => {
        try {
            const data = await creditsService.getBalance();
            setBalance(data);
            setError(null);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Failed to load balance";
            setError(message);
            // Don't show toast on initial load, only on refresh
        }
    }, []);

    const fetchPackages = useCallback(async () => {
        try {
            const data = await creditsService.getPackages();
            setPackages(data);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Failed to load packages";
            console.error("Failed to fetch packages:", message);
        }
    }, []);

    const refresh = useCallback(async () => {
        setLoading(true);
        await Promise.all([fetchBalance(), fetchPackages()]);
        setLoading(false);
    }, [fetchBalance, fetchPackages]);

    const refreshBalance = useCallback(async () => {
        try {
            const data = await creditsService.getBalance();
            setBalance(data);
            setError(null);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Failed to refresh balance";
            toast.error(message);
        }
    }, []);

    const refreshPackages = useCallback(async () => {
        try {
            const data = await creditsService.getPackages();
            setPackages(data);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Failed to refresh packages";
            toast.error(message);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    // Computed properties
    const hasCredits = (balance?.credits_balance ?? 0) > 0;
    const canApply = hasCredits; // 1 credit per application

    return {
        balance,
        packages,
        loading,
        error,
        refreshBalance,
        refreshPackages,
        refresh,
        hasCredits,
        canApply,
    };
}

/**
 * Hook for managing credit transaction history
 */
export function useCreditsHistory(
    initialPageSize: number = 10
): UseCreditsHistoryReturn {
    const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterType, setFilterType] = useState<string>("");

    const fetchHistory = useCallback(
        async (params?: HistoryParams) => {
            setLoading(true);
            try {
                const typeParam = params?.type !== undefined ? params.type : filterType;
                const data = await creditsService.getHistory({
                    page: params?.page || currentPage,
                    limit: params?.limit || initialPageSize,
                    type: typeParam || undefined,
                });
                setTransactions(data.transactions);
                setPagination(data.pagination);
                setError(null);
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : "Failed to load history";
                setError(message);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        },
        [currentPage, filterType, initialPageSize]
    );

    const setPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const setFilter = useCallback((type: string) => {
        setFilterType(type);
        setCurrentPage(1); // Reset to first page when filter changes
    }, []);

    // Force refresh the history (useful after purchase/deduction)
    const refetch = useCallback(async () => {
        setCurrentPage(1); // Reset to first page
        await fetchHistory({ page: 1, limit: initialPageSize, type: filterType || undefined });
    }, [fetchHistory, initialPageSize, filterType]);

    // Fetch on mount and when page/filter changes
    useEffect(() => {
        fetchHistory();
    }, [currentPage, filterType]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        transactions,
        pagination,
        loading,
        error,
        fetchHistory,
        setPage,
        setFilter,
        refetch,
    };
}

/**
 * Hook for checking if user has sufficient credits
 */
export function useCreditsCheck() {
    const { balance, loading, refreshBalance } = useCredits();

    const checkSufficientCredits = useCallback(
        (required: number = 1): boolean => {
            if (!balance) return false;
            return balance.credits_balance >= required;
        },
        [balance]
    );

    const getCreditsShortfall = useCallback(
        (required: number = 1): number => {
            if (!balance) return required;
            return Math.max(0, required - balance.credits_balance);
        },
        [balance]
    );

    return {
        balance,
        loading,
        refreshBalance,
        checkSufficientCredits,
        getCreditsShortfall,
        hasAnyCredits: (balance?.credits_balance ?? 0) > 0,
    };
}

export default useCredits;
