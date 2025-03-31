
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, List, Database, FileText, FileClock, User, Users, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button 
          onClick={() => navigate('/file-fir')}
          className="bg-fir-blue-medium hover:bg-fir-blue-dark"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          File New FIR
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-fir-blue-light to-fir-blue-medium text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Welcome back</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <User className="h-12 w-12 mr-4 bg-white/20 p-2 rounded-full" />
              <div>
                <h3 className="text-xl font-bold">{user.name}</h3>
                <p className="capitalize">{user.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/file-fir')}
            >
              <FileText className="h-4 w-4 mr-2" />
              File New FIR
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/firs')}
            >
              <List className="h-4 w-4 mr-2" />
              View All FIRs
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Database className="h-4 w-4 mr-2 text-fir-blue-medium" />
                  <span>Blockchain</span>
                </div>
                <span className="text-green-500 flex items-center">
                  <span className="h-2 w-2 bg-green-500 rounded-full mr-1 animate-pulse-slow"></span>
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-fir-blue-medium" />
                  <span>Last Sync</span>
                </div>
                <span className="text-gray-500">2 minutes ago</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-fir-blue-medium" />
                  <span>Active Users</span>
                </div>
                <span className="text-gray-500">24</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Recent FIRs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Stolen Vehicle Report</h3>
                    <p className="text-sm text-muted-foreground">Filed by: John Doe</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium">
                    Pending
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>FIR-2023-004</span>
                  <span>2 hours ago</span>
                </div>
              </div>
              
              <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Mobile Phone Theft</h3>
                    <p className="text-sm text-muted-foreground">Filed by: Jane Smith</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                    Investigating
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>FIR-2023-003</span>
                  <span>1 day ago</span>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  variant="link"
                  onClick={() => navigate('/firs')}
                  className="text-fir-blue-medium"
                >
                  View all FIRs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              {user.role === 'police' ? 'Officer Tools' : 'User Tools'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user.role === 'police' ? (
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <FileClock className="h-4 w-4 mr-2" />
                  Update FIR Status
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Verify FIR on Blockchain
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/file-fir')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  File New FIR
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <FileClock className="h-4 w-4 mr-2" />
                  Check FIR Status
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
