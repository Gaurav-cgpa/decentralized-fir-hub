
import FIRList from '@/components/fir/FIRList';
import { Shield, Search, Database } from 'lucide-react';

const ViewFIRs = () => {
  return (
    <div>
      <div className="mb-8 border-b pb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-fir-blue-light/20 p-2 rounded-full">
            <Shield className="h-6 w-6 text-fir-blue-medium" />
          </div>
          <h1 className="text-3xl font-bold">Public FIR Registry</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="flex gap-3">
            <div className="bg-fir-blue-light/10 p-2 rounded-full h-10 w-10 flex items-center justify-center">
              <Search className="h-5 w-5 text-fir-blue-medium" />
            </div>
            <div>
              <h3 className="font-medium text-fir-blue-medium">Transparent Access</h3>
              <p className="text-sm text-muted-foreground">Search and browse all registered FIRs with powerful filtering</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="bg-fir-blue-light/10 p-2 rounded-full h-10 w-10 flex items-center justify-center">
              <Database className="h-5 w-5 text-fir-blue-medium" />
            </div>
            <div>
              <h3 className="font-medium text-fir-blue-medium">Blockchain Verification</h3>
              <p className="text-sm text-muted-foreground">All records are immutably stored on the blockchain</p>
            </div>
          </div>
        </div>
      </div>
      
      <FIRList />
    </div>
  );
};

export default ViewFIRs;
