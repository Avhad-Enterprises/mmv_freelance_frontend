/**
 * Simple logger utility for consistent logging
 * Can be extended to integrate with external logging services
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
    [key: string]: any;
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';

    private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
        const timestamp = new Date().toISOString();
        const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
        return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
    }

    info(message: string, context?: LogContext) {
        if (this.isDevelopment) {
            console.info(this.formatMessage('info', message, context));
        }
    }

    warn(message: string, context?: LogContext) {
        if (this.isDevelopment) {
            console.warn(this.formatMessage('warn', message, context));
        }
    }

    error(message: string, error?: any, context?: LogContext) {
        const errorContext = {
            ...context,
            error: error?.message || String(error),
            stack: error?.stack
        };

        // Always log errors, even in production
        console.error(this.formatMessage('error', message, errorContext));

        // In production, you might send to error tracking service
        // Example: Sentry.captureException(error, { extra: context });
    }

    debug(message: string, context?: LogContext) {
        if (this.isDevelopment) {
            console.debug(this.formatMessage('debug', message, context));
        }
    }
}

// Export singleton instance
export const logger = new Logger();
