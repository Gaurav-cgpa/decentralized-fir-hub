
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ArrowLeft, FileText, Map, User } from 'lucide-react';
import { blockchainService, FIR } from '@/services/blockchainService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

const FIRAnalysis = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);
  const [pendingFIRs, setPendingFIRs] = useState<FIR[]>([]);
  const [filterOfficer, setFilterOfficer] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Only police can view this page
    if (user?.role !== 'police') {
      navigate('/dashboard');
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load statistics
        const stats = await blockchainService.getFIRStatistics();
        setStatistics(stats);

        // Load pending FIRs
        const firs = await blockchainService.getFIRs({ status: 'pending' });
        setPendingFIRs(firs);
      } catch (error) {
        console.error('Error loading analysis data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, navigate, user]);

  const statusData = statistics ? [
    { name: 'Pending', value: statistics.pendingCount },
    { name: 'Investigating', value: statistics.investigatingCount },
    { name: 'Closed', value: statistics.closedCount }
  ] : [];

  // Filter pending FIRs by officer name
  const filteredPendingFIRs = filterOfficer
    ? pendingFIRs.filter(fir => 
        fir.policeName.toLowerCase().includes(filterOfficer.toLowerCase())
      )
    : pendingFIRs;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-fir-blue-medium" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">FIR Analysis Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Pending FIRs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <span className="text-3xl font-bold">{statistics?.pendingCount || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Investigating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <span className="text-3xl font-bold">{statistics?.investigatingCount || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Closed FIRs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <span className="text-3xl font-bold">{statistics?.closedCount || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="status">
        <TabsList className="mb-4">
          <TabsTrigger value="status">Status Distribution</TabsTrigger>
          <TabsTrigger value="location">Location Analysis</TabsTrigger>
          <TabsTrigger value="officer">Officer Workload</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="pending">Pending FIRs</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>FIR Status Distribution</CardTitle>
              <CardDescription>
                Overview of FIRs by current status
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>FIRs by Location</CardTitle>
              <CardDescription>
                Distribution of FIRs across different locations
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statistics?.firsByLocation}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="location" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" name="Number of FIRs" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="officer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cases by Police Officer</CardTitle>
              <CardDescription>
                Distribution of FIRs handled by each police officer
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statistics?.firsByOfficer}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="officer" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" name="Number of FIRs" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>FIR Registration Timeline</CardTitle>
              <CardDescription>
                Number of FIRs registered over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={statistics?.firsByMonth}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    name="Number of FIRs" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending FIRs Analysis</CardTitle>
              <CardDescription>
                Detailed list of pending FIRs that require action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="filterOfficer">Filter by Police Officer</Label>
                <Input
                  id="filterOfficer"
                  placeholder="Type officer name to filter..."
                  value={filterOfficer}
                  onChange={(e) => setFilterOfficer(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {filteredPendingFIRs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {filterOfficer ? 'No pending FIRs match your filter' : 'No pending FIRs found'}
                  </div>
                ) : (
                  filteredPendingFIRs.map((fir) => (
                    <div 
                      key={fir.id} 
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => navigate(`/fir/${fir.id}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-medium">{fir.title}</h3>
                          <div className="text-sm text-gray-500 flex items-center">
                            <User className="h-3.5 w-3.5 mr-1" /> 
                            {fir.policeName}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Map className="h-3.5 w-3.5 mr-1" /> 
                            {fir.location}
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs font-medium">
                            Pending
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            Filed: {new Date(fir.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FIRAnalysis;
