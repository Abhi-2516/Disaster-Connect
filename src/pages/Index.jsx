import { Link } from 'react-router-dom';
import Hero from '@/components/Hero'; // Will now import Hero.jsx
import Navbar from '@/components/Navbar'; // Will now import Navbar.jsx
import IncidentCard from '@/components/IncidentCard'; // Will now import IncidentCard.jsx
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap } from 'lucide-react'; // Added an icon
import { useIncidentStore } from '@/lib/store';

const Index = () => {
  const { incidents } = useIncidentStore();
  const recentIncidents = incidents.slice(0, 3); // Get the 3 most recent incidents

  return (
    // Set the dark background for the whole page
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero component takes up the first "screen" */}
        <Hero />
        
        {/* Recent Incidents Section */}
        <section className="py-20 px-4 sm:px-6 relative bg-slate-950">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-3 text-white">Recent Incidents</h2>
                <p className="text-slate-400 max-w-2xl">
                  Stay informed about the latest reported emergencies and disasters.
                </p>
              </div>
              
              <Button asChild variant="outline" className="mt-4 md:mt-0 text-slate-300 border-slate-700 hover:bg-slate-800/60 hover:text-white">
                <Link to="/feed">
                  View All Incidents
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentIncidents.length > 0 ? (
                recentIncidents.map((incident, index) => (
                  <div 
                    key={incident.id}
                    className="animate-slide-up"
                    style={{ 
                      animationDelay: `${index * 150}ms`, 
                      animationFillMode: 'backwards' 
                    }}
                  >
                    <IncidentCard incident={incident} />
                  </div>
                ))
              ) : (
                // Empty state for recent incidents
                <div className="col-span-3 text-center py-12 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                  <p className="text-slate-400 mb-4">No incidents have been reported yet.</p>
                  <Button asChild>
                    <Link to="/report">Report an Incident</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 px-4 sm:px-6 bg-slate-900/70 border-t border-b border-slate-700/60">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-3 text-center text-white">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-center mb-16">
              Disaster Connect enables real-time emergency reporting through a simple process.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Report Incidents', description: 'See an emergency? Report it with details, location, and photos.', number: '01' },
                { title: 'Share Information', description: 'Your reports help others stay informed and make better decisions.', number: '02' },
                { title: 'Stay Updated', description: 'Receive alerts about incidents in your area or track emergencies worldwide.', number: '03' },
              ].map((step, index) => (
                <div 
                  key={index}
                  className="bg-slate-800/40 backdrop-blur-md border border-slate-700/60 rounded-xl p-6 relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:border-primary/50"
                >
                  <span className="absolute top-0 right-0 text-8xl font-bold text-slate-700/50 transform translate-x-4 -translate-y-4 pointer-events-none">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-semibold mb-4 text-white">{step.title}</h3>
                  <p className="text-slate-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-red-500/10 rounded-full filter blur-3xl animate-pulse-slow animation-delay-3000"></div>
          </div>
          
          <div className="container mx-auto max-w-4xl bg-slate-800/40 backdrop-blur-md border border-slate-700/60 rounded-xl p-8 md:p-12 text-center">
            <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Help Keep Your Community Safe
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-8">
              Your reports can make a difference. Join thousands of others in creating a 
              real-time emergency response network that saves lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/report">Report an Incident</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-slate-300 border-slate-700 hover:bg-slate-800/60 hover:text-white">
                <Link to="/map">Explore the Map</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-700/60 py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <Link to="/" className="flex items-center justify-center md:justify-start text-primary font-semibold text-xl">
                Disaster Connect
              </Link>
              <p className="text-sm text-slate-400 mt-2">
                Crowdsourced Disaster Response Network
              </p>
            </div>
            
            <div className="flex gap-8">
              <div>
                <h3 className="font-medium mb-3 text-white">Pages</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                  <li><Link to="/map" className="hover:text-primary transition-colors">Map</Link></li>
                  <li><Link to="/feed" className="hover:text-primary transition-colors">Incident Feed</Link></li>
                  <li><Link to="/report" className="hover:text-primary transition-colors">Report</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-3 text-white">Resources</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700/60 mt-10 pt-6 text-center text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Disaster Connect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
