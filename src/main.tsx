
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MONGODB_STATUS } from './config/mongodb.ts'
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

// Check if backend is reachable
async function checkBackendConnection() {
  if (MONGODB_STATUS.isBackendConfigured) {
    try {
      const response = await fetch(`${MONGODB_STATUS.backendUrl}/firs`, { 
        method: 'HEAD',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }
      console.log('Successfully connected to backend');
    } catch (error) {
      console.error('Backend connection failed:', error);
      toast({
        variant: "destructive",
        title: "Backend Connection Failed",
        description: MONGODB_STATUS.backendMissingMessage,
      });
    }
  }
}

// Render app
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <>
      <App />
      <Toaster />
    </>
  );
  
  // Check backend connection after rendering
  checkBackendConnection();
}
