
import { useEffect } from 'react';
import FIRForm from '@/components/fir/FIRForm';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const FileFIR = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/file-fir' } });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex justify-center items-center">
      <FIRForm />
    </div>
  );
};

export default FileFIR;
