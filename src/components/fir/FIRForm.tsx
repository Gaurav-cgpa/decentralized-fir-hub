
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { blockchainService } from '@/services/blockchainService';
import { FileText, Loader2, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const FIRForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    victimName: '',
    complainantName: '',
    natureOfOffence: '',
    policeName: user?.role === 'police' ? user.name : '',
    policeBatchId: '',
    policeStationName: '',
    witnessName: '',
    location: '',
    dateTime: new Date().toISOString().slice(0, 16),
    status: 'pending' as const
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const fir = await blockchainService.fileFIR(formData);
      
      toast({
        title: "FIR Filed Successfully",
        description: `The FIR has been recorded with ID: ${fir.id}`,
      });
      
      navigate(`/fir/${fir.id}`);
    } catch (error) {
      console.error('Error filing FIR:', error);
      toast({
        variant: "destructive",
        title: "Failed to file FIR",
        description: "There was an error submitting your report. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only police can file FIRs
  if (user?.role !== 'police') {
    return (
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">Unauthorized Access</CardTitle>
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
    );
  }

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-2xl">File a First Information Report (FIR)</CardTitle>
        <CardDescription>
          Fill out the form below to register an official police FIR. All fields are required.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">FIR Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Brief title describing the incident"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Provide a detailed account of the incident"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="victimName">Victim's Full Name</Label>
              <Input
                id="victimName"
                name="victimName"
                placeholder="Full name of the victim"
                value={formData.victimName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="complainantName">Complainant's Full Name</Label>
              <Input
                id="complainantName"
                name="complainantName"
                placeholder="Full name of the person filing complaint"
                value={formData.complainantName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="natureOfOffence">Nature of Offence</Label>
            <Input
              id="natureOfOffence"
              name="natureOfOffence"
              placeholder="Type of crime or offence (e.g., Theft, Assault)"
              value={formData.natureOfOffence}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="policeName">Police Officer Name</Label>
              <Input
                id="policeName"
                name="policeName"
                placeholder="Name of recording officer"
                value={formData.policeName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="policeBatchId">Police Batch ID</Label>
              <Input
                id="policeBatchId"
                name="policeBatchId"
                placeholder="Officer's badge/batch number"
                value={formData.policeBatchId}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="policeStationName">Police Station Name</Label>
              <Input
                id="policeStationName"
                name="policeStationName"
                placeholder="Name of the police station"
                value={formData.policeStationName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="witnessName">Witness Name(s)</Label>
              <Input
                id="witnessName"
                name="witnessName"
                placeholder="Names of witnesses (if any)"
                value={formData.witnessName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Incident Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="Address or location description"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateTime">Date and Time of Incident</Label>
              <Input
                id="dateTime"
                name="dateTime"
                type="datetime-local"
                value={formData.dateTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-fir-blue-medium hover:bg-fir-blue-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Filing FIR on Blockchain...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Submit FIR
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FIRForm;
