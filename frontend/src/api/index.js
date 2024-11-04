const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Your API calls would then use BASE_URL
const api = {
  login: (data) => fetch(`${BASE_URL}/api/login`, {
    // ... rest of your fetch configuration
  }),
  // ... other API calls
}; 