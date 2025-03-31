
// This is a simplified mock implementation for the frontend
// In a real application, you would use libraries like ethers.js or web3.js
// to connect to a real blockchain network

import { toast } from '@/components/ui/use-toast';

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
  private firs: FIR[] = [
    {
      id: 'FIR-2023-001',
      title: 'Stolen Vehicle Report',
      description: 'My car was stolen from the shopping mall parking lot',
      victimName: 'John Doe',
      complainantName: 'John Doe',
      natureOfOffence: 'Theft',
      policeName: 'Officer James Wilson',
      policeBatchId: 'PB-2345',
      policeStationName: 'Central Police Station',
      witnessName: 'Sarah Johnson',
      location: 'Central Mall, New Delhi',
      dateTime: '2023-10-15T14:30',
      status: 'investigating',
      isVerified: true,
      timestamp: 1697379000000,
      ipfsCID: 'QmX7TJmx5xW8zzF9eSHUQZvCq6c2tpk95Gbq3xhMGxPHWr',
      blockchainTxHash: '0x7f5d96c42e3d3b11f62b41b26e8b2ac98329c81dbca6e48f3d49feb4d13469a2',
      evidence: [
        {
          type: 'text',
          content: 'Witness statement: I saw a tall man with a black jacket near the vehicle around 2:15 PM.',
          description: 'Witness statement from Sarah Johnson',
          timestamp: 1697379600000
        },
        {
          type: 'image',
          content: 'https://example.com/cctv-image-1.jpg',
          description: 'CCTV image from mall entrance',
          timestamp: 1697379000000
        }
      ]
    },
    {
      id: 'FIR-2023-002',
      title: 'Apartment Break-in',
      description: 'My apartment was broken into while I was at work',
      victimName: 'Jane Smith',
      complainantName: 'Jane Smith',
      natureOfOffence: 'Burglary',
      policeName: 'Officer Robert Chen',
      policeBatchId: 'PB-3456',
      policeStationName: 'West District Police Station',
      witnessName: 'Mark Thompson',
      location: 'Green Heights, Mumbai',
      dateTime: '2023-11-02T08:15',
      status: 'pending',
      isVerified: true,
      timestamp: 1698902100000,
      ipfsCID: 'QmUJf2aeSV2vxKfS1K8HAwwgHj8ya71uEA96nYKWr1XG2M',
      blockchainTxHash: '0x3a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef',
      evidence: [
        {
          type: 'text',
          content: 'Fingerprint analysis shows three distinct prints on the door handle.',
          description: 'Forensic report',
          timestamp: 1698912000000
        }
      ]
    },
    {
      id: 'FIR-2023-003',
      title: 'Mobile Phone Snatching',
      description: 'My phone was snatched by a person on motorcycle',
      victimName: 'Raj Kumar',
      complainantName: 'Raj Kumar',
      natureOfOffence: 'Robbery',
      policeName: 'Officer Priya Singh',
      policeBatchId: 'PB-4567',
      policeStationName: 'South Zone Police Station',
      witnessName: 'Anand Verma',
      location: 'MG Road, Bangalore',
      dateTime: '2023-11-10T19:45',
      status: 'investigating',
      isVerified: true,
      timestamp: 1699636500000,
      ipfsCID: 'QmZ9VxZEEGLBzMYzQnY5q6a54GJy6aMNTXJ6zwrBBqQS1d',
      blockchainTxHash: '0xdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abc',
      evidence: [
        {
          type: 'image',
          content: 'https://example.com/traffic-cam-1.jpg',
          description: 'Traffic camera footage showing suspect on motorcycle',
          timestamp: 1699636800000
        },
        {
          type: 'video',
          content: 'https://example.com/cctv-clip-1.mp4',
          description: 'CCTV clip from nearby shop',
          timestamp: 1699637000000
        }
      ]
    }
  ];

  private generateFirId(): string {
    const date = new Date();
    const year = date.getFullYear();
    const count = this.firs.length + 1;
    return `FIR-${year}-${count.toString().padStart(3, '0')}`;
  }

  // Simulate storing a FIR on the blockchain
  public async fileFIR(firData: Omit<FIR, 'id' | 'isVerified' | 'timestamp' | 'ipfsCID' | 'blockchainTxHash'>): Promise<FIR> {
    // In a real implementation, you would:
    // 1. Store the FIR data on IPFS
    // 2. Store the IPFS hash on the blockchain
    // 3. Return the transaction details
    
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
      
      this.firs.unshift(newFIR);
      
      return newFIR;
    } catch (error) {
      console.error('Error filing FIR:', error);
      toast({
        variant: "destructive",
        title: "Failed to file FIR",
        description: "There was an error connecting to the blockchain. Please try again.",
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
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let filteredFIRs = [...this.firs];
    
    if (filters) {
      if (filters.location) {
        filteredFIRs = filteredFIRs.filter(fir => 
          fir.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      
      if (filters.startDate) {
        const startTimestamp = new Date(filters.startDate).getTime();
        filteredFIRs = filteredFIRs.filter(fir => fir.timestamp >= startTimestamp);
      }
      
      if (filters.endDate) {
        const endTimestamp = new Date(filters.endDate).getTime() + (24 * 60 * 60 * 1000); // Add a day to include the end date
        filteredFIRs = filteredFIRs.filter(fir => fir.timestamp <= endTimestamp);
      }

      if (filters.policeName) {
        filteredFIRs = filteredFIRs.filter(fir =>
          fir.policeName.toLowerCase().includes(filters.policeName!.toLowerCase())
        );
      }

      if (filters.status) {
        filteredFIRs = filteredFIRs.filter(fir => 
          fir.status === filters.status
        );
      }
    }
    
    return filteredFIRs;
  }

  public async getFIRById(id: string): Promise<FIR | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const fir = this.firs.find(f => f.id === id);
    return fir || null;
  }

  public async verifyFIR(id: string): Promise<boolean> {
    // Simulate blockchain verification process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const fir = this.firs.find(f => f.id === id);
    if (fir) {
      // In a real implementation, you would verify the FIR's hash on the blockchain
      return fir.isVerified;
    }
    return false;
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
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const pendingCount = this.firs.filter(fir => fir.status === 'pending').length;
    const investigatingCount = this.firs.filter(fir => fir.status === 'investigating').length;
    const closedCount = this.firs.filter(fir => fir.status === 'closed').length;
    
    // Group FIRs by location
    const locationCounts: Record<string, number> = {};
    this.firs.forEach(fir => {
      const location = fir.location.split(',').pop()?.trim() || fir.location;
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });
    
    const firsByLocation = Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count);
    
    // Group FIRs by police officer
    const officerCounts: Record<string, number> = {};
    this.firs.forEach(fir => {
      officerCounts[fir.policeName] = (officerCounts[fir.policeName] || 0) + 1;
    });
    
    const firsByOfficer = Object.entries(officerCounts)
      .map(([officer, count]) => ({ officer, count }))
      .sort((a, b) => b.count - a.count);
    
    // Group FIRs by month
    const monthCounts: Record<string, number> = {};
    this.firs.forEach(fir => {
      const date = new Date(fir.timestamp);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
    });
    
    const firsByMonth = Object.entries(monthCounts)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
    
    return {
      pendingCount,
      investigatingCount,
      closedCount,
      firsByLocation,
      firsByOfficer,
      firsByMonth
    };
  }
}

// Export a singleton instance
export const blockchainService = new BlockchainService();
