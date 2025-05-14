export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown): APIError {
  if (error instanceof APIError) {
    return error;
  }

  if (error instanceof Error) {
    return new APIError(error.message);
  }

  return new APIError('An unexpected error occurred');
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Unable to connect to the server. Please check your internet connection.';
      case 'TIMEOUT':
        return 'The request timed out. Please try again.';
      case 'BACKEND_ERROR':
        return 'The server encountered an error. Please try again later.';
      default:
        return error.message || 'An error occurred while processing your request.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
} 