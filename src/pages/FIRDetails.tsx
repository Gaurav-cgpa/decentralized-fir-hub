
import { useParams } from 'react-router-dom';
import FIRDetail from '@/components/fir/FIRDetail';
import { Shield, FileText } from 'lucide-react';

const FIRDetails = () => {
  const { id } = useParams();
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Shield className="h-8 w-8 text-fir-blue-medium" />
          FIR Details
        </h1>
        <p className="text-muted-foreground flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Viewing details for FIR #{id}
        </p>
      </div>
      <FIRDetail />
    </div>
  );
};

export default FIRDetails;
