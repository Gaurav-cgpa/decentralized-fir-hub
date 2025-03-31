
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { Shield, LogOut, UserPlus, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-fir-blue-dark text-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-fir-accent" />
          <Link to="/" className="text-xl font-bold">
            <span className="text-fir-accent">Block</span>Chain FIR
          </Link>
        </div>
        
        <div className="flex items-center space-x-6">
          <Link to="/firs" className="hover:text-fir-accent transition-colors">
            Public FIRs
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-fir-accent transition-colors">
                Dashboard
              </Link>
              
              <div className="flex items-center gap-2">
                <span className="hidden md:inline text-sm">
                  {user?.name} ({user?.role})
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hover:text-fir-accent hover:bg-transparent"
                  onClick={() => logout()}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="ml-2 sm:hidden md:inline">Logout</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="hover:text-fir-accent hover:bg-transparent"
                onClick={() => navigate('/login')}
              >
                <LogIn className="h-4 w-4" />
                <span className="ml-2">Login</span>
              </Button>
              
              <Button 
                size="sm"
                className="bg-fir-accent hover:bg-fir-accent/80 text-white"
                onClick={() => navigate('/signup')}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                <span>Sign Up</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
