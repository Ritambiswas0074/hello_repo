export const formatError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Retry a database query with exponential backoff
 * Handles Neon pooler connection timeouts and transient errors
 */
export async function withDbRetry<T>(
  queryFn: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await queryFn();
    } catch (error: any) {
      lastError = error;
      
      // Retry on connection errors (P1001, P1017, P1008)
      const isConnectionError = 
        error.code === 'P1001' || // Can't reach database server
        error.code === 'P1017' || // Server closed connection
        error.code === 'P1008' || // Operations timed out
        error.message?.includes('Can\'t reach database server') ||
        error.message?.includes('connection');
      
      if (isConnectionError && attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`⚠️  Database connection error (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // For non-connection errors or final attempt, throw immediately
      throw error;
    }
  }
  
  throw lastError;
}

