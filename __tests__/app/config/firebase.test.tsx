import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
}));

describe('firebase config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_FIREBASE_API_KEY: 'api-key',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'auth-domain',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'project-id',
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'storage-bucket',
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: 'sender-id',
      NEXT_PUBLIC_FIREBASE_APP_ID: 'app-id',
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: 'measurement-id',
    };

    (initializeApp as jest.Mock).mockReturnValue('app-instance');
    (getAuth as jest.Mock).mockReturnValue('auth-instance');
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it.skip('initializes Firebase app and auth using environment configuration', async () => {
    // eslint-disable-next-line @next/next/no-assign-module-variable
    const module = await import('@/app/config/firebase');

    expect(initializeApp).toHaveBeenCalledWith({
      apiKey: 'api-key',
      authDomain: 'auth-domain',
      projectId: 'project-id',
      storageBucket: 'storage-bucket',
      messagingSenderId: 'sender-id',
      appId: 'app-id',
      measurementId: 'measurement-id',
    });

    expect(module.app).toBe('app-instance');
    expect(getAuth).toHaveBeenCalledWith('app-instance');
    expect(module.auth).toBe('auth-instance');
  });
});
