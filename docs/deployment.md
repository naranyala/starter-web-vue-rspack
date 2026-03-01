# Deployment Guide

This document provides comprehensive guidance on deploying the application to various platforms and environments.

## Table of Contents

- [Build Process](#build-process)
- [Build Output](#build-output)
- [Deployment Platforms](#deployment-platforms)
- [Environment Variables](#environment-variables)
- [Production Checklist](#production-checklist)
- [Performance Optimization](#performance-optimization)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Build Process

### Development Build

For local development with hot module replacement:

```bash
bun run dev
```

### Production Build

For production deployment:

```bash
bun run build
```

This creates an optimized build with:

- Minified JavaScript and CSS
- Code splitting
- Tree shaking
- Asset optimization
- Hash-based filenames for caching

### Incremental Build

For faster builds during testing:

```bash
bun run build:incremental
```

## Build Output

### Directory Structure

After running `bun run build`, the `dist/` directory contains:

```
dist/
├── index.html
├── js/
│   ├── index.[contenthash].js
│   └── vendors.[contenthash].js
└── css/
    └── index.[contenthash].css
```

### File Naming

- `[contenthash]` - Content-based hash for cache busting
- `index.js` - Application code
- `vendors.js` - Third-party dependencies

### Asset Sizes

Typical production build sizes:

| Asset Type | Size (gzipped) |
|------------|----------------|
| JavaScript | 40-60 KB |
| CSS | 10-20 KB |
| HTML | 2-5 KB |

## Deployment Platforms

### Static Hosting

The application produces static files that can be deployed to any static hosting service.

#### Netlify

1. Connect your repository to Netlify
2. Configure build settings:
   - Build command: `bun run build`
   - Publish directory: `dist`
3. Deploy

**netlify.toml** configuration:

```toml
[build]
  command = "bun run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Vercel

1. Import your project to Vercel
2. Configure build settings:
   - Build command: `bun run build`
   - Output directory: `dist`
3. Deploy

**vercel.json** configuration:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### GitHub Pages

1. Install gh-pages:
   ```bash
   bun add -d gh-pages
   ```

2. Add deploy script to package.json:
   ```json
   {
     "scripts": {
       "deploy": "bun run build && gh-pages -d dist"
     }
   }
   ```

3. Update base path in rspack.config.mjs:
   ```javascript
   output: {
     publicPath: '/repository-name/',
   }
   ```

4. Deploy:
   ```bash
   bun run deploy
   ```

#### AWS S3 + CloudFront

1. Create S3 bucket
2. Configure bucket for static hosting
3. Upload build contents to S3
4. Create CloudFront distribution
5. Configure caching headers

**AWS CLI deployment:**

```bash
# Sync files to S3
aws s3 sync dist/ s3://your-bucket-name/

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

#### Docker

**Dockerfile:**

```dockerfile
# Build stage
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install
COPY . .
RUN bun run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**

```nginx
server {
  listen 80;
  server_name localhost;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /js {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  location /css {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

**Build and run:**

```bash
docker build -t vue-rspack-app .
docker run -p 80:80 vue-rspack-app
```

### Self-Hosted Server

#### Apache

**.htaccess:**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/javascript "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

#### Nginx

**Server configuration:**

```nginx
server {
  listen 80;
  server_name your-domain.com;
  root /var/www/html/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
  gzip_min_length 1000;
}
```

## Environment Variables

### Configuration

Environment variables can be configured for different environments:

```bash
# .env.development
VITE_API_URL=http://localhost:8080
VITE_APP_VERSION=1.0.0-dev

# .env.production
VITE_API_URL=https://api.production.com
VITE_APP_VERSION=1.0.0
```

### Access in Code

```typescript
// Access environment variables
const apiUrl = import.meta.env.VITE_API_URL;
const version = import.meta.env.VITE_APP_VERSION;
```

### Build-time Variables

Pass variables during build:

```bash
VITE_API_URL=https://api.example.com bun run build
```

## Production Checklist

### Pre-Deployment

- [ ] Run full test suite: `bun test`
- [ ] Run type check: `bun run type-check`
- [ ] Run linting: `bun run check`
- [ ] Build production bundle: `bun run build`
- [ ] Test production build locally
- [ ] Verify environment variables
- [ ] Update version numbers

### Security

- [ ] Enable HTTPS
- [ ] Configure CSP headers
- [ ] Remove source maps (or restrict access)
- [ ] Sanitize user inputs
- [ ] Implement rate limiting
- [ ] Enable CORS properly

### Performance

- [ ] Enable compression (gzip/brotli)
- [ ] Configure caching headers
- [ ] Set up CDN
- [ ] Optimize images
- [ ] Minimize bundle size
- [ ] Enable HTTP/2

### Monitoring

- [ ] Set up error tracking
- [ ] Configure analytics
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation
- [ ] Set up performance monitoring

## Performance Optimization

### Bundle Analysis

Analyze bundle size:

```bash
bun add -d @rspack/cli
bun run build --analyze
```

### Code Splitting

Configure code splitting in rspack.config.prod.mjs:

```javascript
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: -10,
      },
      common: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true,
      },
    },
  },
}
```

### Lazy Loading

Lazy load routes and components:

```typescript
// Lazy load route component
const HomeView = defineAsyncComponent(
  () => import('@/views/HomeView.vue')
);

// Lazy load heavy component
const HeavyComponent = defineAsyncComponent(
  () => import('@/components/HeavyComponent.vue')
);
```

### Image Optimization

```bash
# Install image optimization tools
bun add -d imagemin imagemin-pngquant imagemin-mozjpeg

# Optimize images
imagemin src/assets/images/* --out-dir=dist/images
```

## Monitoring

### Error Tracking

Integrate error tracking:

```typescript
// src/main.ts
import { useErrorTracker } from '@/core/errorTracker';

const errorTracker = useErrorTracker();

// Track errors
errorTracker.logError('AppComponent', error, {
  userId: user.id,
  page: route.path,
});
```

### Performance Monitoring

```typescript
// Track page load performance
window.addEventListener('load', () => {
  const timing = performance.timing;
  const loadTime = timing.loadEventEnd - timing.navigationStart;
  console.log('Page load time:', loadTime, 'ms');
});
```

### Analytics

```typescript
// Track page views
function trackPageView(path: string) {
  // Send to analytics service
  analytics.page({ path });
}

// Track events
function trackEvent(name: string, properties: Record<string, unknown>) {
  analytics.track(name, properties);
}
```

## Troubleshooting

### Build Fails

1. Clear cache and rebuild:
   ```bash
   bun run clean
   bun run build
   ```

2. Check for TypeScript errors:
   ```bash
   bun run type-check
   ```

3. Check for linting errors:
   ```bash
   bun run check
   ```

### Runtime Errors

1. Check browser console for errors
2. Verify environment variables
3. Check network requests
4. Review error tracking logs

### Performance Issues

1. Analyze bundle size
2. Check network waterfall
3. Review Core Web Vitals
4. Profile in browser DevTools

### Deployment Issues

1. Verify build output
2. Check server configuration
3. Review CDN settings
4. Check CORS configuration

## Related Documentation

- [Architecture Overview](./architecture.md)
- [CSS Guide](./css-guide.md)
- [TypeScript Guide](./typescript-guide.md)
