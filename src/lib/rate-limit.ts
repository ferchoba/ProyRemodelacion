import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Helper seguro para crear cliente Redis solo con credenciales válidas
function getRedisClient(): Redis | undefined {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    // Validar que la URL sea https y que no sean placeholders
    const looksValid =
      typeof url === 'string' &&
      url.startsWith('https://') &&
      !/your_upstash_redis_url/i.test(url) &&
      typeof token === 'string' &&
      token.length > 10 &&
      !/your_upstash_redis_token/i.test(token);

    if (!looksValid) return undefined;

    return new Redis({ url, token });
  } catch (e) {
    console.warn('Upstash Redis no se inicializó (se usará modo sin rate-limit):', e);
    return undefined;
  }
}

const redisClient = getRedisClient();

function createLimiter(limit: number, window: `${number} m` | `${number} s`, prefix: string) {
  if (!redisClient) {
    // Wrapper que simula éxito cuando no hay Redis configurado
    const noop = {
      limit: async (_id: string) => ({ success: true, limit: 0, remaining: 0, reset: Date.now() + 60_000 }),
    } as unknown as Ratelimit;
    return noop;
  }

  return new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(limit, window),
    analytics: true,
    prefix,
  });
}

// Rate limiter para formularios (más restrictivo)
export const formRateLimit = createLimiter(3, '10 m', 'form_ratelimit');

// Rate limiter para API general (menos restrictivo)
export const apiRateLimit = createLimiter(30, '1 m', 'api_ratelimit');

// Rate limiter para páginas estáticas (muy permisivo)
export const pageRateLimit = createLimiter(100, '1 m', 'page_ratelimit');

// Función para obtener IP del cliente
export function getClientIP(request: Request): string {
  // Intentar obtener IP de headers de proxy
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  
  // Fallback para desarrollo local
  return '127.0.0.1';
}

// Función helper para aplicar rate limiting
export async function applyRateLimit(
  rateLimit: Ratelimit,
  identifier: string
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
  error?: string;
}> {
  try {
    const result = await rateLimit.limit(identifier);
    
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: new Date(result.reset),
    };
  } catch (error) {
    console.error('Error aplicando rate limit:', error);
    
    // En caso de error, permitir la request (fail-open)
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: new Date(),
      error: 'Rate limit service unavailable',
    };
  }
}

// Headers de rate limit para respuestas
export function getRateLimitHeaders(result: {
  limit: number;
  remaining: number;
  reset: Date;
}): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.reset.getTime() / 1000).toString(),
  };
}

// Función para crear respuesta de rate limit excedido
export function createRateLimitResponse(result: {
  limit: number;
  remaining: number;
  reset: Date;
}): Response {
  const headers = getRateLimitHeaders(result);
  
  return new Response(
    JSON.stringify({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((result.reset.getTime() - Date.now()) / 1000),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }
  );
}
