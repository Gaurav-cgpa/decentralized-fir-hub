
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { blockchainService, FIR } from '@/services/blockchainService';
import { MapPin, Calendar, User, FileCheck, Shield, ArrowLeft, Loader2, HelpCircle, Network, Award, Briefcase, Building, Users, Image, Video, FileText } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from '@/contexts/AuthContext';

const FIRDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [fir, setFir] = useState<FIR | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchFIR = async () => {
      if (!id) return;
      
      try {
        const data = await blockchainService.getFIRById(id);
        setFir(data);
      } catch (error) {
        console.error('Error fetching FIR details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFIR();
  }, [id]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const verifyOnBlockchain = async () => {
    if (!id) return;
    
    setIsVerifying(true);
    try {
      const isVerified = await blockchainService.verifyFIR(id);
      if (isVerified && fir) {
        setFir({ ...fir, isVerified });
      }
    } catch (error) {
      console.error('Error verifying FIR:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'investigating':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'closed':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-fir-blue-medium" />
      </div>
    );
  }

  if (!fir) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">FIR Not Found</h2>
        <p className="text-muted-foreground mb-4">The FIR you're looking for doesn't exist or has been removed</p>
        <Button 
          onClick={() => navigate('/firs')}
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to FIR List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={() => navigate('/firs')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to FIR List
        </Button>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={verifyOnBlockchain}
                disabled={isVerifying}
                className="border-fir-blue-light text-fir-blue-medium hover:bg-fir-blue-light/10"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Verify on Blockchain
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Verify the authenticity of this FIR on the blockchain</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Card className="blockchain-verified">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">{fir.title}</CardTitle>
              <CardDescription className="text-base">
                <Badge className={statusColor(fir.status)}>
                  {fir.status.charAt(0).toUpperCase() + fir.status.slice(1)}
                </Badge>
                <span className="ml-2">FIR ID: {fir.id}</span>
              </CardDescription>
            </div>
            {fir.isVerified && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      <Shield className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">Blockchain Verified</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This FIR has been verified and secured on the blockchain</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Incident Details</h3>
            <div className="px-4 py-3 bg-gray-50 rounded-md">
              <p className="text-gray-700 whitespace-pre-line">{fir.description}</p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-600">Nature of Offence:</span>
                <Badge variant="outline" className="ml-2">{fir.natureOfOffence}</Badge>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <User className="h-5 w-5 mr-2 text-fir-blue-medium" />
                Victim & Complainant Information
              </h3>
              <div className="space-y-4">
                <div className="px-4 py-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Victim Name</p>
                  <p className="text-gray-700">{fir.victimName}</p>
                </div>
                <div className="px-4 py-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Complainant Name</p>
                  <p className="text-gray-700">{fir.complainantName}</p>
                </div>
                <div className="px-4 py-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Witness Name(s)</p>
                  <p className="text-gray-700">{fir.witnessName}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Award className="h-5 w-5 mr-2 text-fir-blue-medium" />
                Police Information
              </h3>
              <div className="space-y-4">
                <div className="px-4 py-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Recorded By</p>
                  <p className="text-gray-700">{fir.policeName}</p>
                </div>
                <div className="px-4 py-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Police Batch ID</p>
                  <p className="text-gray-700">{fir.policeBatchId}</p>
                </div>
                <div className="px-4 py-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-600">Police Station</p>
                  <p className="text-gray-700">{fir.policeStationName}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-fir-blue-medium" />
                Location Information
              </h3>
              <div className="px-4 py-3 bg-gray-50 rounded-md">
                <p className="text-gray-700">{fir.location}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-fir-blue-medium" />
                Date & Time Information
              </h3>
              <div className="px-4 py-3 bg-gray-50 rounded-md">
                <p className="text-gray-700">{formatDate(fir.timestamp)}</p>
              </div>
            </div>
          </div>
          
          {/* Evidence Section - Only visible to police */}
          {user?.role === 'police' && fir.evidence && fir.evidence.length > 0 && (
            <>
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-fir-blue-medium" />
                  Evidence (Police Only)
                </h3>
                <div className="space-y-4">
                  {fir.evidence.map((item, index) => (
                    <div key={index} className="px-4 py-3 bg-gray-50 rounded-md">
                      <div className="flex items-center mb-2">
                        {item.type === 'text' && <FileText className="h-4 w-4 mr-2 text-blue-500" />}
                        {item.type === 'image' && <Image className="h-4 w-4 mr-2 text-green-500" />}
                        {item.type === 'video' && <Video className="h-4 w-4 mr-2 text-purple-500" />}
                        <p className="text-sm font-medium text-gray-600">
                          {item.description}
                        </p>
                        <span className="ml-auto text-xs text-gray-500">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                      
                      {item.type === 'text' && (
                        <div className="p-3 bg-white rounded border text-gray-700 whitespace-pre-line">
                          {item.content}
                        </div>
                      )}
                      
                      {item.type === 'image' && (
                        <div className="p-2 bg-white rounded border">
                          <a href={item.content} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline block">
                            <img 
                              src={item.content} 
                              alt={item.description} 
                              className="max-h-48 max-w-full mx-auto object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                              }}
                            />
                            <div className="text-center text-xs mt-2">Click to open original image</div>
                          </a>
                        </div>
                      )}
                      
                      {item.type === 'video' && (
                        <div className="p-2 bg-white rounded border">
                          <a href={item.content} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline block text-center py-4">
                            <Video className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                            <span>Click to view video evidence</span>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          
          <Separator />
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Network className="h-5 w-5 mr-2 text-fir-blue-medium" />
              Blockchain Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <p className="text-sm font-medium text-gray-600">IPFS Content ID</p>
                <p className="text-sm font-mono bg-white p-2 rounded border overflow-x-auto">
                  {fir.ipfsCID || "Not yet stored on IPFS"}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600">Blockchain Transaction Hash</p>
                <p className="text-sm font-mono bg-white p-2 rounded border overflow-x-auto">
                  {fir.blockchainTxHash || "Not yet stored on blockchain"}
                </p>
              </div>
            </div>
            
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <HelpCircle className="h-3 w-3 mr-1" />
              This information can be used to verify the authenticity of this FIR on the blockchain
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FIRDetail;
