import 'dotenv/config';

// Server Operations
export const environment = process.env.NODE_ENV ?? 'development';
export const port = process.env.PORT ?? 8080;
export const cacheTime = process.env.CACHE_TIME ?? 0;

// Keys
export const databaseURI =
  (environment == 'development'
    ? process.env.DATABASE_URI_DEV
    : process.env.DATABASE_URI) ?? '';
export const clerkKey = process.env.CLERK_SECRET_KEY;
export const mapboxKey = process.env.MAPBOX_SECRET_KEY;

// Security
export const allowedOrigin = process.env.ALLOWED_ORIGIN ?? '*';
export const jwtTokenSecret = process.env.AUTH_TOKEN_SECRET ?? '';
export const jwtTokenLifetime = process.env.AUTH_TOKEN_LIFETIME ?? '1h';
