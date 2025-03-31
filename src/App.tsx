
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect } from "react";
import { mongoService } from "./services/mongoService";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import FileFIR from "./pages/FileFIR";
import ViewFIRs from "./pages/ViewFIRs";
import FIRDetails from "./pages/FIRDetails";
import FIRAnalysis from "./pages/FIRAnalysis";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Initialize MongoDB connection
  useEffect(() => {
    const initMongoDB = async () => {
      try {
        await mongoService.connect();
      } catch (error) {
        console.error("Failed to initialize MongoDB:", error);
      }
    };
    
    initMongoDB();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/file-fir" element={<FileFIR />} />
                <Route path="/firs" element={<ViewFIRs />} />
                <Route path="/fir/:id" element={<FIRDetails />} />
                <Route path="/fir-analysis" element={<FIRAnalysis />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
