/**
 * Chat-related constants
 * Centralized configuration for chat functionality
 */

export const CHAT_CONSTANTS = {
    // Pagination
    MESSAGES_PER_PAGE: 50,

    // Timeouts
    TYPING_INDICATOR_TIMEOUT: 3000, // 3 seconds
    ERROR_DISMISS_TIME: 5000, // 5 seconds
    INFO_DISMISS_TIME: 3000, // 3 seconds
    PROFILE_FETCH_DEBOUNCE: 300, // 300ms

    // Retry logic
    MAX_RETRY_ATTEMPTS: 3,
    RETRY_BASE_DELAY: 1000, // 1 second

    // Message validation
    MAX_MESSAGE_LENGTH: 5000,
    MIN_MESSAGE_LENGTH: 1,

    // Timestamps
    MESSAGE_TIMESTAMP_THRESHOLD: 5000, // 5 seconds - for matching pending messages

    // Connection
    RECONNECT_DELAY: 2000, // 2 seconds
} as const;

// Type-safe access to constants
export type ChatConstants = typeof CHAT_CONSTANTS;
