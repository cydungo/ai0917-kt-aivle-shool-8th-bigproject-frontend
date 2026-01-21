import { http, HttpResponse } from 'msw';

// Define the base URL from environment variables
// If it's not set, default to localhost:8080 (standard Spring Boot)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export const handlers = [
  // Mock: Auth - Me (Session Check)
  http.get(`${BACKEND_URL}/api/v1/auth/me`, () => {
    // Simulate a logged-in user
    // To simulate a logged-out state, you can comment this out and return 401
    return HttpResponse.json({
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'ADMIN', // Try changing this to 'MANAGER' or 'AUTHOR' to test permissions
      },
    });

    // Simulate Not Authenticated
    // return new HttpResponse(null, { status: 401 });
  }),

  // Mock: Auth - Login
  http.post(`${BACKEND_URL}/api/v1/auth/login`, async ({ request }) => {
    const info = await request.json();
    console.log('Login attempt with:', info);

    return HttpResponse.json({
      success: true,
      message: 'Login successful (Mocked)',
    });
  }),

  // Mock: Auth - Logout
  http.post(`${BACKEND_URL}/api/v1/auth/logout`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Logout successful (Mocked)',
    });
  }),
];
