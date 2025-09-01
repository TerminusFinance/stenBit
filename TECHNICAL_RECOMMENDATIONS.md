# stenBit Technical Recommendations & Action Items

## Immediate Actions Required (Priority: CRITICAL)

### 1. Security Vulnerabilities
```bash
# Fix critical security issues
npm audit fix --force

# Update vulnerable packages specifically
npm update elliptic cipher-base pbkdf2 sha.js form-data axios rollup cross-spawn
```

### 2. ESLint Errors (Must Fix)
```typescript
// Fix @ts-ignore usage in ProfileScreen.tsx and CheckScreen.tsx
// Replace with @ts-expect-error with explanation
// @ts-expect-error: TMA SDK type definitions incomplete
```

```typescript
// Fix empty blocks in TasksScreen.tsx and main.tsx
try {
    postEvent('web_app_expand');
} catch (error) {
    console.warn('Failed to expand web app:', error);
}
```

### 3. React Hooks Dependencies
Critical files to fix:
- `src/components/home/friendsScreen/FriendsScreen.tsx` (line 26)
- `src/components/home/levelScreen/LevelScreen.tsx` (line 39)
- `src/components/home/profileScreen/ProfileScreen.tsx` (line 53, 60)
- `src/components/home/tapScreen/TapScreen.tsx` (line 92)
- `src/components/home/tasksScreen/TasksScreen.tsx` (line 121)

## Package Updates & Migration

### 1. Migrate TMA SDK
```bash
# Remove deprecated packages
npm uninstall @tma.js/sdk @tma.js/sdk-react

# Install new packages
npm install @telegram-apps/sdk @telegram-apps/sdk-react
```

### 2. Update main.tsx
```typescript
// Replace imports
import { initData, postEvent } from '@telegram-apps/sdk';
import { SDKProvider } from '@telegram-apps/sdk-react';
```

### 3. Update ESLint
```bash
npm install --save-dev eslint@^9.0.0 @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest
```

## Performance Optimizations

### 1. Implement Code Splitting
```typescript
// App.tsx - Convert to lazy loading
import { lazy, Suspense } from 'react';

const HomeScreen = lazy(() => import('./components/home/Home'));
const TapScreen = lazy(() => import('./components/home/tapScreen/TapScreen'));
const FriendsScreen = lazy(() => import('./components/home/friendsScreen/FriendsScreen'));

// Wrap routes in Suspense
<Suspense fallback={<LoadingScreen />}>
  <Routes>
    {/* routes */}
  </Routes>
</Suspense>
```

### 2. Bundle Analysis Setup
```bash
npm install --save-dev rollup-plugin-visualizer
```

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: { Buffer: true },
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ton: ['ton', 'ton-core', 'ton-crypto'],
          tma: ['@telegram-apps/sdk', '@telegram-apps/sdk-react'],
        },
      },
    },
  },
});
```

### 3. Image Optimization
```bash
npm install --save-dev vite-plugin-imagemin imagemin-webp imagemin-pngquant
```

## Code Quality Improvements

### 1. Add Testing Infrastructure
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### 2. Vitest Configuration (vitest.config.ts)
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

### 3. Test Setup File (src/test/setup.ts)
```typescript
import '@testing-library/jest-dom';
import { beforeAll, vi } from 'vitest';

// Mock TMA SDK
beforeAll(() => {
  vi.mock('@telegram-apps/sdk', () => ({
    postEvent: vi.fn(),
    retrieveLaunchParams: vi.fn(() => ({ initDataRaw: 'mock' })),
  }));
});
```

### 4. Example Component Test
```typescript
// src/components/__tests__/DataContext.test.tsx
import { render, screen } from '@testing-library/react';
import { DataProvider, useData } from '../DataContext';

const TestComponent = () => {
  const { dataApp } = useData();
  return <div>Coins: {dataApp.coins}</div>;
};

describe('DataProvider', () => {
  it('provides initial data', () => {
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );
    
    expect(screen.getByText('Coins: 0')).toBeInTheDocument();
  });
});
```

## API & Error Handling

### 1. Environment Configuration
```typescript
// src/config/environment.ts
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};
```

### 2. Error Boundary Component
```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 3. Enhanced API Error Handling
```typescript
// src/core/dataWork/ApiClient.ts
import axios, { AxiosError } from 'axios';
import { config } from '../../config/environment';

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle authentication errors
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## CI/CD Pipeline

### 1. GitHub Actions Workflow (.github/workflows/ci.yml)
```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm audit --audit-level high
```

## Monitoring & Analytics

### 1. Add Performance Monitoring
```bash
npm install web-vitals
```

```typescript
// src/utils/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export const initAnalytics = () => {
  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
};
```

### 2. Error Tracking
```bash
npm install @sentry/react @sentry/tracing
```

```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}
```

## Implementation Timeline

### Week 1: Critical Fixes
- [ ] Security vulnerabilities (Day 1-2)
- [ ] ESLint errors (Day 3)
- [ ] React hooks dependencies (Day 4-5)

### Week 2: Dependencies & Testing
- [ ] TMA SDK migration (Day 1-2)
- [ ] Testing infrastructure (Day 3-4)
- [ ] Error boundaries (Day 5)

### Week 3: Performance
- [ ] Code splitting (Day 1-2)
- [ ] Bundle optimization (Day 3-4)
- [ ] Image optimization (Day 5)

### Week 4: Monitoring & CI/CD
- [ ] CI/CD pipeline (Day 1-2)
- [ ] Monitoring setup (Day 3)
- [ ] Documentation updates (Day 4-5)

## Success Metrics

- [ ] 0 security vulnerabilities
- [ ] 0 ESLint errors
- [ ] Bundle size < 1MB
- [ ] Test coverage > 80%
- [ ] Build time < 2 minutes
- [ ] Lighthouse score > 90