
import FIRList from '@/components/fir/FIRList';

const ViewFIRs = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Public FIR Registry</h1>
      <p className="text-muted-foreground mb-8">
        Browse and search through all publicly registered First Information Reports. All records are securely stored on the blockchain for transparency and immutability.
      </p>
      <FIRList />
    </div>
  );
};

export default ViewFIRs;
