# API Configuration Overview

## Environment Variables Structure

The Musical Zoe frontend has been configured with a modular approach to API endpoint management, where all API URLs are defined in environment files rather than being hardcoded in server routes.

### Environment Files

#### Development (`.env.development`)

```bash
# Base API Configuration
VITE_API_BASE_URL="http://localhost:4000/v1"
VITE_API_SIGNUP_URL="${VITE_API_BASE_URL}/api"
VITE_API_ACTIVATION_URL="${VITE_API_BASE_URL}/api/activated"
VITE_API_AUTHENTICATION_URL="${VITE_API_BASE_URL}/api/authentication"

# Music API Endpoints
VITE_MUSIC_API_NEWS_URL="${VITE_API_BASE_URL}/musical/news"
VITE_MUSIC_API_TRENDS_URL="${VITE_API_BASE_URL}/musical/trends"
VITE_MUSIC_API_LYRICS_URL="${VITE_API_BASE_URL}/musical/lyrics"
VITE_MUSIC_API_TRACK_INFO_URL="${VITE_API_BASE_URL}/musical/track-info"
VITE_MUSIC_API_HEALTH_URL="${VITE_API_BASE_URL}/health"
```

#### Production (`.env.production`)

```bash
# Base API Configuration
VITE_API_BASE_URL="https://api.musical-zoe.com/v1"
VITE_API_SIGNUP_URL="${VITE_API_BASE_URL}/api"
VITE_API_ACTIVATION_URL="${VITE_API_BASE_URL}/api/activated"
VITE_API_AUTHENTICATION_URL="${VITE_API_BASE_URL}/authentication"

# Music API Endpoints
VITE_MUSIC_API_NEWS_URL="${VITE_API_BASE_URL}/musical/news"
VITE_MUSIC_API_TRENDS_URL="${VITE_API_BASE_URL}/musical/trends"
VITE_MUSIC_API_LYRICS_URL="${VITE_API_BASE_URL}/musical/lyrics"
VITE_MUSIC_API_TRACK_INFO_URL="${VITE_API_BASE_URL}/musical/track-info"
VITE_MUSIC_API_HEALTH_URL="${VITE_API_BASE_URL}/health"
```

## Server Route Implementation

Each server route imports its specific endpoint URL directly from the environment variables:

### News API (`/api/music/news/+server.ts`)

```typescript
import { VITE_MUSIC_API_NEWS_URL } from '$env/static/private';

// Direct usage without concatenation
const apiUrl = new URL(VITE_MUSIC_API_NEWS_URL);
```

### Trends API (`/api/music/trends/+server.ts`)

```typescript
import { VITE_MUSIC_API_TRENDS_URL } from '$env/static/private';

// Direct usage without concatenation
const apiUrl = new URL(VITE_MUSIC_API_TRENDS_URL);
```

### Lyrics API (`/api/music/lyrics/+server.ts`)

```typescript
import { VITE_MUSIC_API_LYRICS_URL } from '$env/static/private';

// Direct usage without concatenation
const apiUrl = new URL(VITE_MUSIC_API_LYRICS_URL);
```

### Track Info API (`/api/music/track-info/+server.ts`)

```typescript
import { VITE_MUSIC_API_TRACK_INFO_URL } from '$env/static/private';

// Direct usage without concatenation
const apiUrl = new URL(VITE_MUSIC_API_TRACK_INFO_URL);
```

## Benefits of This Approach

1. **Environment Isolation**: Different API endpoints for development and production
2. **No Hardcoding**: All URLs are centrally managed in environment files
3. **Easy Maintenance**: Changes to API endpoints only require updating the `.env` files
4. **Type Safety**: SvelteKit's environment variable system provides compile-time checks
5. **Security**: Private environment variables are only available on the server side
6. **Flexibility**: Easy to add new endpoints or modify existing ones

## Adding New API Endpoints

To add a new API endpoint:

1. Add the environment variable to both `.env.development` and `.env.production`:

   ```bash
   VITE_MUSIC_API_NEW_ENDPOINT_URL="${VITE_API_BASE_URL}/musical/new-endpoint"
   ```

2. Create a new server route that imports the variable:

   ```typescript
   import { VITE_MUSIC_API_NEW_ENDPOINT_URL } from '$env/static/private';

   const apiUrl = new URL(VITE_MUSIC_API_NEW_ENDPOINT_URL);
   ```

3. No server restart is needed for environment variable changes in development mode.

## Configuration Validation

All server routes include:

- Bearer token authentication
- Query parameter validation
- Error handling and logging
- Type-safe API responses using TypeScript interfaces

This configuration ensures maintainable, secure, and scalable API integration for the Musical Zoe dashboard.
