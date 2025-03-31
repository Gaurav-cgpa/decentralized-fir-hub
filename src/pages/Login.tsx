
import LoginForm from '@/components/auth/LoginForm';
import { Shield } from 'lucide-react';

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center">
          <Shield className="h-10 w-10 text-fir-blue-medium" />
        </div>
        <h1 className="mt-2 text-3xl font-bold">
          <span className="text-fir-accent">Block</span>
          <span className="text-fir-blue-medium">Chain</span> FIR
        </h1>
        <p className="mt-2 text-muted-foreground">
          Decentralized and transparent FIR filing and monitoring
        </p>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
