import { Link } from 'react-router-dom';
import { AlertTriangle, MapPin, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Set scrolled state after scrolling past 10px
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    // Cleanup function to remove the event listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'py-3 bg-slate-950/80 backdrop-blur-lg border-b border-slate-700/60 shadow-2xl' 
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo / Brand Link */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-white font-semibold text-xl transition-transform duration-300 hover:scale-105"
            onClick={() => setMobileMenuOpen(false)} // Close menu on logo click
          >
            <AlertTriangle className="h-5 w-5 text-primary" />
            <span>Disaster Connect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link 
              to="/" 
              className="text-slate-300 hover:text-white transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Home
            </Link>
            <Link 
              to="/map" 
              className="text-slate-300 hover:text-white transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Map View
            </Link>
            <Link 
              to="/feed" 
              className="text-slate-300 hover:text-white transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Incident Feed
            </Link>
            <Button 
              asChild 
              className="animate-pulse-soft shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
            >
              <Link to="/report">
                <MapPin className="h-4 w-4 mr-2" />
                Report Incident
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-slate-200 hover:text-white hover:bg-slate-700/50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

 
      {mobileMenuOpen && (
        <div 
          className="md:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-lg shadow-2xl rounded-b-lg overflow-hidden origin-top animate-slide-down"
        >
          <div className="px-4 pt-2 pb-5 space-y-2">
            <Link 
              to="/" 
              className="block text-slate-300 hover:text-white hover:bg-primary/10 rounded-md px-3 py-3 text-base transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/map" 
              className="block text-slate-300 hover:text-white hover:bg-primary/10 rounded-md px-3 py-3 text-base transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Map View
            </Link>
            <Link 
              to="/feed" 
              className="block text-slate-300 hover:text-white hover:bg-primary/10 rounded-md px-3 py-3 text-base transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Incident Feed
            </Link>
            <Button asChild variant="default" className="w-full justify-center py-6 text-base mt-2">
              <Link 
                to="/report" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Report Incident
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;