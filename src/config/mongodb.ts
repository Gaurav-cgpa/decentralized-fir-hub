
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
  isBackendConfigured: true, // Set to true since we're now configuring a backend
  backendUrl: "http://localhost:3001", // The URL where our backend will be running
  backendMissingMessage: "MongoDB integration requires a backend server. " +
    "Please ensure the backend server is running at " + "http://localhost:3001"
};
