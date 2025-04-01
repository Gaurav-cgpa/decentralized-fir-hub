
export const MONGODB_CONFIG = {
  // Your MongoDB connection string
  url: 'mongodb://localhost:27017'
};

// IMPORTANT SECURITY NOTE:
// This approach is NOT secure for production applications as it exposes your MongoDB credentials in client-side code.
// For production, you should:
// 1. Use a backend server to handle database connections
// 2. Use environment variables on the server side
// 3. Consider using Supabase or another backend service for secure database access

export const MONGODB_STATUS = {
  isBackendConfigured: false, // Set this to true when you have a working backend
  backendMissingMessage: "MongoDB integration requires a backend server. " +
    "The app is currently not sending data to MongoDB because there's no backend server configured. " +
    "Please set up a backend API and update the 'apiUrl' in apiService.ts."
};
