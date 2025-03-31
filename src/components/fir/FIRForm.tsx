
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { blockchainService } from '@/services/blockchainService';
import { FileText, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FIRForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    complainantName: '',
    complainantContact: '',
    suspectDetails: '',
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
        description: `Your FIR has been recorded with ID: ${fir.id}`,
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

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-2xl">File a First Information Report (FIR)</CardTitle>
        <CardDescription>
          Fill out the form below to register your complaint. All fields are required.
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
              rows={5}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="complainantName">Your Full Name</Label>
              <Input
                id="complainantName"
                name="complainantName"
                placeholder="John Doe"
                value={formData.complainantName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="complainantContact">Contact Information</Label>
              <Input
                id="complainantContact"
                name="complainantContact"
                placeholder="Email or phone number"
                value={formData.complainantContact}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="suspectDetails">Suspect Details (if any)</Label>
            <Textarea
              id="suspectDetails"
              name="suspectDetails"
              placeholder="Provide any information about the suspect(s)"
              rows={3}
              value={formData.suspectDetails}
              onChange={handleChange}
              required
            />
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
