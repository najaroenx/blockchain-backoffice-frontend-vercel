import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill TextEncoder and TextDecoder for Node.js environment
global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

// Import whatwg-fetch to get Response implementation
import 'whatwg-fetch';

// Polyfill Response.json static method for Next.js API routes
// Next.js uses Response.json() which isn't available in whatwg-fetch
if (typeof Response !== 'undefined' && !Response.json) {
  (Response as any).json = (data: any, init?: ResponseInit) => {
    const bodyInit = JSON.stringify(data);
    const headers = new Headers(init?.headers);
    headers.set('Content-Type', 'application/json');
    
    return new Response(bodyInit, {
      ...init,
      headers,
    });
  };
}

afterEach(() => cleanup());

// Mock next/navigation for App Router
jest.mock('next/navigation', () => {
  const push = jest.fn();
  const replace = jest.fn();
  const back = jest.fn();
  const refresh = jest.fn();
  return {
    useRouter: () => ({ push, replace, back, refresh }),
    useSearchParams: () => new URLSearchParams(''),
    notFound: jest.fn(),
    redirect: jest.fn(),
  };
});

// Mock window.matchMedia if missing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    media: query,
    matches: false,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
