
import { useEffect } from 'react';
import FIRForm from '@/components/fir/FIRForm';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FileFIR = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/file-fir' } });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  // Only police can access this page
  if (user && user.role !== 'police') {
    return (
      <div className="flex justify-center items-center py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Access Restricted</CardTitle>
            <CardDescription>
              Only police officers can file new FIR reports.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Shield className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground mb-4">
              If you need to report an incident, please visit your nearest police station.
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/firs')}
            >
              View Existing FIRs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <FIRForm />
    </div>
  );
};

export default FileFIR;
