
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { blockchainService, FIR } from '@/services/blockchainService';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, FileCheck, Loader2, User, Award, FileText } from 'lucide-react';

const FIRList = () => {
  const [firs, setFirs] = useState<FIR[]>([]);
  const [filteredFirs, setFilteredFirs] = useState<FIR[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    startDate: '',
    endDate: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFIRs = async () => {
      try {
        const data = await blockchainService.getFIRs();
        setFirs(data);
        setFilteredFirs(data);
      } catch (error) {
        console.error('Error fetching FIRs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFIRs();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = async () => {
    setIsLoading(true);
    try {
      const data = await blockchainService.getFIRs(filters);
      setFilteredFirs(data);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFilters = async () => {
    setFilters({
      location: '',
      startDate: '',
      endDate: ''
    });
    setIsLoading(true);
    try {
      const data = await blockchainService.getFIRs();
      setFilteredFirs(data);
    } catch (error) {
      console.error('Error resetting filters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'investigating':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Filter FIRs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  name="location"
                  placeholder="Search by location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">From Date</Label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">To Date</Label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex items-end space-x-2">
              <Button 
                onClick={applyFilters}
                className="bg-fir-blue-medium hover:bg-fir-blue-dark"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button 
                variant="outline" 
                onClick={resetFilters}
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Registered FIRs</CardTitle>
          <span className="text-sm text-muted-foreground">
            {filteredFirs.length} {filteredFirs.length === 1 ? 'record' : 'records'} found
          </span>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-fir-blue-medium" />
            </div>
          ) : filteredFirs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No FIRs found matching your criteria
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFirs.map((fir) => (
                <div 
                  key={fir.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors blockchain-verified relative"
                  onClick={() => navigate(`/fir/${fir.id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg">{fir.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(fir.status)}`}>
                      {fir.status.charAt(0).toUpperCase() + fir.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {fir.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-muted-foreground mt-2 border-t pt-2">
                    <div className="flex items-center">
                      <User className="h-3.5 w-3.5 mr-1" />
                      Victim: {fir.victimName}
                    </div>
                    <div className="flex items-center">
                      <Award className="h-3.5 w-3.5 mr-1" />
                      Station: {fir.policeStationName}
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-3.5 w-3.5 mr-1" />
                      {fir.natureOfOffence}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-y-2 text-xs text-muted-foreground mt-2">
                    <div className="flex items-center mr-4">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {fir.location}
                    </div>
                    <div className="flex items-center mr-4">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {formatDate(fir.timestamp)}
                    </div>
                    <div className="flex items-center">
                      <FileCheck className="h-3.5 w-3.5 mr-1" />
                      FIR ID: {fir.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FIRList;
