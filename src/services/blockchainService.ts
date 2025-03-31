
import { toast } from '@/components/ui/use-toast';
import { mongoService } from './mongoService';

export interface Evidence {
  type: 'text' | 'image' | 'video';
  content: string; // For text this is the actual text, for image/video this would be a URL or base64
  description: string;
  timestamp: number;
}

export interface FIR {
  id: string;
  title: string;
  description: string;
  victimName: string;
  complainantName: string;
  natureOfOffence: string;
  policeName: string;
  policeBatchId: string;
  policeStationName: string;
  witnessName: string;
  location: string;
  dateTime: string;
  status: 'pending' | 'investigating' | 'closed';
  isVerified: boolean;
  timestamp: number;
  ipfsCID?: string; // IPFS Content Identifier
  blockchainTxHash?: string; // Blockchain transaction hash
  evidence?: Evidence[]; // New field for evidence
}

class BlockchainService {
  private generateFirId(): string {
    const date = new Date();
    const year = date.getFullYear();
    const count = Math.floor(Math.random() * 900) + 100; // Generate a random 3-digit number
    return `FIR-${year}-${count}`;
  }

  // Simulate storing a FIR on the blockchain and MongoDB
  public async fileFIR(firData: Omit<FIR, 'id' | 'isVerified' | 'timestamp' | 'ipfsCID' | 'blockchainTxHash'>): Promise<FIR> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newFIR: FIR = {
        ...firData,
        id: this.generateFirId(),
        isVerified: true,
        timestamp: Date.now(),
        ipfsCID: `QmX${Math.random().toString(36).substring(2, 15)}`,
        blockchainTxHash: `0x${Math.random().toString(36).substring(2, 40)}`
      };
      
      // Save to MongoDB
      await mongoService.createFIR(newFIR);
      
      return newFIR;
    } catch (error) {
      console.error('Error filing FIR:', error);
      toast({
        variant: "destructive",
        title: "Failed to file FIR",
        description: "There was an error connecting to the database. Please try again.",
      });
      throw error;
    }
  }

  public async getFIRs(filters?: {
    location?: string;
    startDate?: string;
    endDate?: string;
    policeName?: string;
    status?: string;
  }): Promise<FIR[]> {
    try {
      // Get FIRs from MongoDB
      return await mongoService.getFIRs(filters);
    } catch (error) {
      console.error('Error getting FIRs:', error);
      toast({
        variant: "destructive",
        title: "Failed to retrieve FIRs",
        description: "There was an error fetching data from the database. Please try again.",
      });
      return [];
    }
  }

  public async getFIRById(id: string): Promise<FIR | null> {
    try {
      // Get FIR from MongoDB
      return await mongoService.getFIRById(id);
    } catch (error) {
      console.error('Error getting FIR by ID:', error);
      toast({
        variant: "destructive",
        title: "Failed to retrieve FIR",
        description: "There was an error fetching the FIR from the database. Please try again.",
      });
      return null;
    }
  }

  public async verifyFIR(id: string): Promise<boolean> {
    // Simulate blockchain verification process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const fir = await mongoService.getFIRById(id);
      if (fir) {
        // In a real implementation, you would verify the FIR's hash on the blockchain
        return fir.isVerified;
      }
      return false;
    } catch (error) {
      console.error('Error verifying FIR:', error);
      return false;
    }
  }

  // Get statistics for FIR analysis
  public async getFIRStatistics(): Promise<{
    pendingCount: number;
    investigatingCount: number;
    closedCount: number;
    firsByLocation: { location: string; count: number }[];
    firsByOfficer: { officer: string; count: number }[];
    firsByMonth: { month: string; count: number }[];
  }> {
    try {
      // Get statistics from MongoDB
      return await mongoService.getFIRStatistics();
    } catch (error) {
      console.error('Error getting FIR statistics:', error);
      toast({
        variant: "destructive",
        title: "Failed to retrieve statistics",
        description: "There was an error fetching statistics from the database. Please try again.",
      });
      return {
        pendingCount: 0,
        investigatingCount: 0,
        closedCount: 0,
        firsByLocation: [],
        firsByOfficer: [],
        firsByMonth: []
      };
    }
  }
}

// Export a singleton instance
export const blockchainService = new BlockchainService();
