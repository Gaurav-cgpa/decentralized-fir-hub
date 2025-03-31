
import { MongoClient, Db, Collection } from 'mongodb';
import { FIR, Evidence } from './blockchainService';

class MongoService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private firCollection: Collection<FIR> | null = null;
  private connectionString: string = "mongodb://localhost:27017";
  
  // Initialize MongoDB connection
  public async connect(): Promise<void> {
    try {
      console.log("Connecting to MongoDB...");
      this.client = new MongoClient(this.connectionString);
      await this.client.connect();
      this.db = this.client.db("fir_system");
      this.firCollection = this.db.collection<FIR>("firs");
      console.log("Connected to MongoDB successfully");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  // Get all FIRs with optional filters
  public async getFIRs(filters?: {
    location?: string;
    startDate?: string;
    endDate?: string;
    policeName?: string;
    status?: string;
  }): Promise<FIR[]> {
    if (!this.firCollection) {
      await this.connect();
    }

    try {
      let query: any = {};
      
      if (filters) {
        if (filters.location) {
          query.location = { $regex: filters.location, $options: 'i' };
        }
        
        if (filters.startDate || filters.endDate) {
          query.timestamp = {};
          
          if (filters.startDate) {
            query.timestamp.$gte = new Date(filters.startDate).getTime();
          }
          
          if (filters.endDate) {
            query.timestamp.$lte = new Date(filters.endDate).getTime() + (24 * 60 * 60 * 1000);
          }
        }

        if (filters.policeName) {
          query.policeName = { $regex: filters.policeName, $options: 'i' };
        }

        if (filters.status) {
          query.status = filters.status;
        }
      }
      
      return await this.firCollection!.find(query).sort({ timestamp: -1 }).toArray();
    } catch (error) {
      console.error("Error fetching FIRs:", error);
      throw error;
    }
  }

  // Get a specific FIR by ID
  public async getFIRById(id: string): Promise<FIR | null> {
    if (!this.firCollection) {
      await this.connect();
    }

    try {
      return await this.firCollection!.findOne({ id });
    } catch (error) {
      console.error("Error fetching FIR by ID:", error);
      throw error;
    }
  }

  // Create a new FIR
  public async createFIR(fir: FIR): Promise<FIR> {
    if (!this.firCollection) {
      await this.connect();
    }

    try {
      await this.firCollection!.insertOne(fir);
      return fir;
    } catch (error) {
      console.error("Error creating FIR:", error);
      throw error;
    }
  }

  // Get FIR statistics for analysis
  public async getFIRStatistics(): Promise<{
    pendingCount: number;
    investigatingCount: number;
    closedCount: number;
    firsByLocation: { location: string; count: number }[];
    firsByOfficer: { officer: string; count: number }[];
    firsByMonth: { month: string; count: number }[];
  }> {
    if (!this.firCollection) {
      await this.connect();
    }

    try {
      const pendingCount = await this.firCollection!.countDocuments({ status: 'pending' });
      const investigatingCount = await this.firCollection!.countDocuments({ status: 'investigating' });
      const closedCount = await this.firCollection!.countDocuments({ status: 'closed' });
      
      // Get all FIRs for location and officer stats
      const allFIRs = await this.firCollection!.find({}).toArray();
      
      // Group by location
      const locationCounts: Record<string, number> = {};
      allFIRs.forEach(fir => {
        const location = fir.location.split(',').pop()?.trim() || fir.location;
        locationCounts[location] = (locationCounts[location] || 0) + 1;
      });
      
      const firsByLocation = Object.entries(locationCounts)
        .map(([location, count]) => ({ location, count }))
        .sort((a, b) => b.count - a.count);
      
      // Group by officer
      const officerCounts: Record<string, number> = {};
      allFIRs.forEach(fir => {
        officerCounts[fir.policeName] = (officerCounts[fir.policeName] || 0) + 1;
      });
      
      const firsByOfficer = Object.entries(officerCounts)
        .map(([officer, count]) => ({ officer, count }))
        .sort((a, b) => b.count - a.count);
      
      // Group by month
      const monthCounts: Record<string, number> = {};
      allFIRs.forEach(fir => {
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
    } catch (error) {
      console.error("Error fetching FIR statistics:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export const mongoService = new MongoService();
