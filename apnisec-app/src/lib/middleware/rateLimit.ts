import { NextRequest } from 'next/server';
import { RateLimiter } from '../classes/utils/RateLimiter';
import { IRateLimitConfig } from '../types';

export function applyRateLimit(
  request: NextRequest,
  config?: IRateLimitConfig
): void {

  const identifier = getIdentifier(request);
  
  RateLimiter.checkLimit(identifier, config);
}

export function getIdentifier(request: NextRequest): string {

  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }

  return 'unknown-ip';
}