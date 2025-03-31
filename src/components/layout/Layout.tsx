
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-fir-background to-white">
      <div className="bg-fir-blue-dark/5 absolute inset-0 z-0 pattern-grid-lg opacity-10 pointer-events-none"></div>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
