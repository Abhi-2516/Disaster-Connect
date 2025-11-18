
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar'; // Correctly imports Navbar.jsx
import IncidentFeed from '@/components/IncidentFeed'; // Correctly imports IncidentFeed.jsx
import { Button } from '@/components/ui/button';
import { AlertTriangle, Plus } from 'lucide-react';
import { useIncidentStore } from '@/lib/store';

const Feed = () => {
  const { incidents } = useIncidentStore();
  // Type annotation removed from useState for .jsx
  const [userLocation, setUserLocation] = useState(undefined);
  
  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          console.log('User denied geolocation or an error occurred');
        }
      );
    }
  }, []);

  return (
    // Set the dark background for the whole page
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-3 text-white">Emergency Feed</h1>
              <p className="text-slate-400 max-w-2xl">
                Stay updated with the latest emergencies and disasters reported by the community.
              </p>
            </div>
            
            <Button asChild className="mt-4 md:mt-0" size="lg">
              <Link to="/report">
                <Plus className="mr-2 h-4 w-4" />
                Report Incident
              </Link>
            </Button>
          </div>
          
          {incidents.length > 0 ? (
            <IncidentFeed userLocation={userLocation} />
          ) : (
            // Restyled "No Incidents" empty state
            <div className="text-center py-20 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
              <AlertTriangle className="mx-auto h-16 w-16 text-slate-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-3 text-white">No incidents reported yet</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Be the first to report an emergency or disaster in your area to help keep your community informed.
              </p>
              <Button asChild size="lg">
                <Link to="/report">Report an Incident</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      {/* Restyled Footer */}
      <footer className="border-t border-slate-700/60 py-6 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl text-center text-sm text-slate-400">
          &copy; {new Date().getFullYear()} Disaster Connect. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Feed;