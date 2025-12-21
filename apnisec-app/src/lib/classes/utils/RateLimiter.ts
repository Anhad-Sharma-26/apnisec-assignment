import { IRateLimitConfig, IRateLimitInfo } from '../../types';
import { RateLimitError } from '../errors/AppError';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private static records: Map<string, RateLimitRecord> = new Map();
  
  private static readonly DEFAULT_CONFIG: IRateLimitConfig = {
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
  };

  static checkLimit(
    identifier: string,
    config: IRateLimitConfig = this.DEFAULT_CONFIG
  ): IRateLimitInfo {
    const now = Date.now();
    const record = this.records.get(identifier);

    if (!record || now > record.resetTime) {
      const resetTime = now + config.windowMs;
      this.records.set(identifier, { count: 1, resetTime });
      
      return {
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        reset: resetTime,
      };
    }

    if (record.count >= config.maxRequests) {
      throw new RateLimitError(
        `Rate limit exceeded. Try again after ${new Date(record.resetTime).toISOString()}`
      );
    }

    record.count++;
    
    return {
      limit: config.maxRequests,
      remaining: config.maxRequests - record.count,
      reset: record.resetTime,
    };
  }

  static getRateLimitHeaders(info: IRateLimitInfo): Record<string, string> {
    return {
      'X-RateLimit-Limit': info.limit.toString(),
      'X-RateLimit-Remaining': info.remaining.toString(),
      'X-RateLimit-Reset': new Date(info.reset).toISOString(),
    };
  }

  static clearRecords(): void {
    this.records.clear();
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.records.entries()) {
      if (now > record.resetTime) {
        this.records.delete(key);
      }
    }
  }
}

if (typeof setInterval !== 'undefined') {
  setInterval(() => RateLimiter.cleanup(), 5 * 60 * 1000);
}