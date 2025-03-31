
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-fir-blue-dark text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Shield className="h-6 w-6 text-fir-accent mr-2" />
            <span className="text-lg font-bold">
              <span className="text-fir-accent">Block</span>Chain FIR
            </span>
          </div>
          
          <div className="text-center md:text-right text-sm text-gray-300">
            <p>© {new Date().getFullYear()} BlockChain FIR. All rights reserved.</p>
            <p className="mt-1">Secured by blockchain technology</p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h3 className="text-fir-accent font-medium mb-2">About BlockChain FIR</h3>
            <p className="text-gray-300">
              A decentralized platform for filing and monitoring First Information Reports (FIRs) using blockchain technology to ensure transparency and security.
            </p>
          </div>
          
          <div>
            <h3 className="text-fir-accent font-medium mb-2">Quick Links</h3>
            <ul className="space-y-1 text-gray-300">
              <li><a href="/" className="hover:text-fir-accent">Home</a></li>
              <li><a href="/firs" className="hover:text-fir-accent">Public FIRs</a></li>
              <li><a href="/dashboard" className="hover:text-fir-accent">Dashboard</a></li>
              <li><a href="/file-fir" className="hover:text-fir-accent">File a FIR</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-fir-accent font-medium mb-2">Legal</h3>
            <ul className="space-y-1 text-gray-300">
              <li><a href="#" className="hover:text-fir-accent">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-fir-accent">Terms of Service</a></li>
              <li><a href="#" className="hover:text-fir-accent">Data Protection</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
