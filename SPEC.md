# Web Application with REST API Integration Specification

> [!NOTE]
> This document may not reflect the current implementation.
> See the final report for up-to-date state:
> [Final Report](docs/compose/reports/blockchain-backoffice-frontend.md)

## 1. Objective

### Problem Statement
Build a medium-sized web application (3-5 pages) that integrates with REST APIs to display and manage data. The application should provide a seamless user experience with proper error handling and input validation.

### Target Users
- **Primary**: End users who need to view and interact with data from external services
- **Secondary**: Developers maintaining and extending the application

### Success Criteria
- [ ] Application renders 3-5 pages with proper routing
- [ ] Successfully integrates with at least one REST API
- [ ] All user inputs are validated before submission
- [ ] Errors are handled gracefully with user-friendly messages
- [ ] All features have corresponding tests
- [ ] Code follows established patterns and conventions

## 2. Commands

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- [filename]
```

### Code Quality
```bash
# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Type check
npm run typecheck

# Format code
npm run format
```

### Deployment
```bash
# Deploy to Vercel
vercel --prod

# Deploy preview
vercel
```

## 3. Project Structure

```
blockchain-backoffice-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── transactions/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── table.tsx
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── footer.tsx
│   │   └── features/
│   │       ├── transaction-list.tsx
│   │       └── transaction-detail.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── use-api.ts
│   │   └── use-validation.ts
│   ├── types/
│   │   └── index.ts
│   └── styles/
│       └── globals.css
├── tests/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── pages/
├── public/
│   └── assets/
├── config/
│   ├── next.config.js
│   ├── tsconfig.json
│   └── jest.config.js
├── docs/
└── SPEC.md
```

### Key Files
| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout with providers and global styles |
| `src/lib/api.ts` | API client with error handling and retry logic |
| `src/hooks/use-api.ts` | Custom hook for API calls with loading/error states |
| `src/types/index.ts` | TypeScript interfaces and types |
| `src/components/ui/` | Reusable UI components |
| `tests/` | Test files mirroring src structure |

## 4. Code Style

### Naming Conventions
- **Files**: kebab-case (e.g., `transaction-list.tsx`)
- **Components**: PascalCase (e.g., `TransactionList`)
- **Functions/Methods**: camelCase (e.g., `fetchTransactions`)
- **Variables**: camelCase (e.g., `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Types/Interfaces**: PascalCase with descriptive names (e.g., `TransactionData`)

### Import Organization
```typescript
// 1. React and Next.js imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. External libraries
import axios from 'axios';
import { format } from 'date-fns';

// 3. Internal modules (absolute paths)
import { Transaction } from '@/types';
import { fetchTransactions } from '@/lib/api';

// 4. Components
import { Button } from '@/components/ui/button';
import { TransactionList } from '@/components/features/transaction-list';

// 5. Hooks
import { useApi } from '@/hooks/use-api';

// 6. Styles
import './styles.css';
```

### Error Handling
```typescript
// API error handling pattern
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// In components
try {
  const data = await fetchTransactions();
  setTransactions(data);
} catch (error) {
  if (error instanceof ApiError) {
    setError(error.message);
  } else {
    setError('An unexpected error occurred');
  }
}
```

### Documentation
- [ ] All components have JSDoc comments explaining props and usage
- [ ] Complex functions have inline comments explaining logic
- [ ] API endpoints are documented with request/response examples
- [ ] README.md includes setup instructions and architecture overview

## 5. Testing Strategy

### Unit Tests
- **Framework**: Jest + React Testing Library
- **Location**: `tests/` directory mirroring `src/` structure
- **Naming**: `[filename].test.tsx` or `[filename].spec.tsx`
- **Coverage Target**: 80% for components, 90% for utility functions

### Integration Tests
- **Scope**: API integration, form submissions, navigation flows
- **Location**: `tests/integration/`
- **Dependencies**: Mock API responses using MSW (Mock Service Worker)

### End-to-End Tests
- **Framework**: Playwright or Cypress
- **Scope**: Critical user flows (login, data viewing, form submission)
- **Environment**: Local development and CI/CD pipeline

### Test Organization
```
tests/
├── components/
│   ├── ui/
│   │   ├── button.test.tsx
│   │   └── input.test.tsx
│   └── features/
│       └── transaction-list.test.tsx
├── hooks/
│   ├── use-api.test.ts
│   └── use-validation.test.ts
├── lib/
│   ├── api.test.ts
│   └── utils.test.ts
├── pages/
│   ├── dashboard.test.tsx
│   └── transactions.test.tsx
└── integration/
    └── api-integration.test.tsx
```

## 6. Boundaries

### Always Do
- Validate all user input before processing
- Handle errors gracefully with user-friendly messages
- Write tests for new features and bug fixes
- Follow existing code patterns and naming conventions
- Use TypeScript for type safety
- Implement proper loading states for async operations
- Add proper error boundaries for component failures
- Use proper semantic HTML and accessibility attributes

### Ask First
- Adding new npm dependencies
- Modifying the API client configuration
- Changing the project structure significantly
- Implementing new third-party integrations
- Modifying global styles or theme configuration
- Adding new environment variables

### Never Do
- Hardcode API keys, secrets, or credentials
- Skip input validation on user data
- Ignore TypeScript errors or use `any` type excessively
- Commit directly to main branch without review
- Disable error handling or suppress errors
- Use inline styles instead of CSS modules/Tailwind
- Skip loading states for async operations
- Add console.log statements in production code
