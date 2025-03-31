
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Shield, FileText, Search, Database } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-[80vh]">
      {/* Hero Section */}
      <section className="py-16 md:py-24 flex flex-col items-center text-center">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16 text-fir-accent" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="text-fir-accent">Block</span>
            <span className="text-fir-blue-medium">Chain</span> FIR
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            A decentralized platform for filing and monitoring First Information Reports using blockchain technology
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <Button 
                className="bg-fir-blue-medium hover:bg-fir-blue-dark text-white px-8 py-6 text-lg"
                onClick={() => navigate('/file-fir')}
              >
                <FileText className="mr-2 h-5 w-5" />
                File a New FIR
              </Button>
            ) : (
              <Button 
                className="bg-fir-accent hover:bg-fir-accent/90 text-white px-8 py-6 text-lg"
                onClick={() => navigate('/signup')}
              >
                Get Started
              </Button>
            )}
            <Button 
              variant="outline" 
              className="px-8 py-6 text-lg"
              onClick={() => navigate('/firs')}
            >
              <Search className="mr-2 h-5 w-5" />
              View Public FIRs
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-fir-blue-light/20 p-3 rounded-full mb-4">
                <FileText className="h-8 w-8 text-fir-blue-medium" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure FIR Filing</h3>
              <p className="text-muted-foreground">
                File First Information Reports securely with all data encrypted and stored on a distributed blockchain.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-fir-blue-light/20 p-3 rounded-full mb-4">
                <Database className="h-8 w-8 text-fir-blue-medium" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Blockchain Verification</h3>
              <p className="text-muted-foreground">
                All records are verified and secured on the blockchain, ensuring they cannot be tampered with or altered.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-fir-blue-light/20 p-3 rounded-full mb-4">
                <Search className="h-8 w-8 text-fir-blue-medium" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Public Transparency</h3>
              <p className="text-muted-foreground">
                Browse and search through the public registry of FIRs with powerful filtering options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-fir-accent/20 w-12 h-12 rounded-full flex items-center justify-center text-fir-accent font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Account</h3>
              <p className="text-muted-foreground">
                Sign up as a citizen or police officer to access the platform
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-fir-accent/20 w-12 h-12 rounded-full flex items-center justify-center text-fir-accent font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">File a FIR</h3>
              <p className="text-muted-foreground">
                Submit details about the incident in the structured FIR form
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-fir-accent/20 w-12 h-12 rounded-full flex items-center justify-center text-fir-accent font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Blockchain Storage</h3>
              <p className="text-muted-foreground">
                Your FIR is securely stored on the blockchain with a unique ID
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-fir-accent/20 w-12 h-12 rounded-full flex items-center justify-center text-fir-accent font-bold mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor the status and updates of your filed FIRs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-fir-blue-dark text-white">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our decentralized FIR platform today and experience the security and transparency of blockchain technology.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <Button 
                className="bg-fir-accent hover:bg-fir-accent/90 text-white px-8"
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  className="bg-fir-accent hover:bg-fir-accent/90 text-white px-8"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up Now
                </Button>
                <Button 
                  variant="outline" 
                  className="text-white border-white hover:bg-white hover:text-fir-blue-dark px-8"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
