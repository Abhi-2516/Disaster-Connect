import { useEffect, useRef, useState } from 'react';
// Incident type import removed
import RangeSelector from './RangeSelector';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Flame, 
  Waves, 
  AlertTriangle, 
  Wind, 
  CloudLightning,
  Mountain,
  X // Added for close button
} from 'lucide-react';

// Mock map view component
// Type annotations removed from props
const MapView = ({ incidents }) => {
  const mapRef = useRef(null); // type removed
  const [radius, setRadius] = useState(50);
  const [activeIncident, setActiveIncident] = useState(null); // type removed

  // Mock map initialization and markers
  useEffect(() => {
    if (!mapRef.current) return;
    
    console.log('Map would initialize here with', incidents.length, 'incidents');
    // In a real implementation, we would initialize the map here 
    // and add markers for each incident
    
    const mockSetUserLocation = () => {
      console.log('Setting user location');
    };
    
    mockSetUserLocation();
  }, [incidents]);

  // Get icon based on incident type
  const getIncidentIcon = (type) => { // type removed
    switch (type) {
      case 'fire':
        return <Flame className="h-5 w-5 text-red-400" />;
      case 'flood':
        return <Waves className="h-5 w-5 text-blue-400" />;
      case 'earthquake':
        return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      case 'hurricane':
      case 'tornado':
        return <Wind className="h-5 w-5 text-indigo-400" />;
      case 'landslide':
        return <Mountain className="h-5 w-5 text-amber-400" />;
      case 'tsunami':
        return <Waves className="h-5 w-5 text-blue-400" />;
      default:
        return <CloudLightning className="h-5 w-5 text-slate-400" />;
    }
  };

  return (
    <div className="relative h-full w-full min-h-[500px] flex flex-col">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 bg-slate-800/40 backdrop-blur-md border border-slate-700/60 rounded-xl p-4 shadow-lg max-w-xs animate-fade-in">
        <RangeSelector 
          value={radius} 
          onChange={setRadius} 
          className="w-full" 
        />
      </div>
      
      {/* Map Container - This would be replaced with an actual map */}
      <div 
        ref={mapRef} 
        className="flex-1 bg-slate-900/50 relative overflow-hidden rounded-lg border border-slate-700/60"
      >
        {/* Mock Map UI */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent to-slate-950/20">
          <div className="text-center">
            <p className="text-slate-400 mb-3">Interactive map would render here</p>
            <p className="text-sm text-slate-500 mb-6">
              With {incidents.length} incidents within {radius === -1 ? 'global range' : `${radius}km radius`}
            </p>
          </div>
        </div>
        
        {/* Mock Incident Markers */}
        <div className="absolute inset-0">
          {incidents.map((incident, index) => (
            <button
              key={incident.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                activeIncident?.id === incident.id 
                  ? 'z-30 scale-125' 
                  : 'z-20 hover:scale-110'
              }`}
              style={{ 
                // Random positioning for mock-up
                left: `${(incident.id * 37) % 80 + 10}%`, 
                top: `${(incident.id * 53) % 80 + 10}%`,
                animationDelay: `${index * 100}ms`
              }}
              onClick={() => setActiveIncident(incident)}
            >
              <div className={`rounded-full p-2 border-2 bg-slate-800/60 backdrop-blur-sm ${
                incident.severity === 'high' 
                  ? 'border-red-500/80' 
                  : incident.severity === 'medium' 
                    ? 'border-amber-500/80' 
                    : 'border-blue-500/80'
              }`}>
                {getIncidentIcon(incident.type)}
              </div>
              
              {/* Pulse animation for high severity */}
              {incident.severity === 'high' && (
                <span className="absolute inset-0 rounded-full animate-ping bg-red-500/30"></span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Active Incident Information */}
      {activeIncident && (
        <div 
          className="absolute bottom-4 left-4 right-4 z-20 
            bg-slate-800/60 backdrop-blur-md border border-slate-700/60 
            rounded-lg p-4 shadow-lg animate-slide-up max-w-md mx-auto text-slate-200"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-white">{activeIncident.title}</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50" 
              onClick={() => setActiveIncident(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-slate-400 mb-3 line-clamp-2">
            {activeIncident.description}
          </p>
          
          <div className="flex items-center text-sm mb-2">
            <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" />
            <span>
              {activeIncident.location.address || 
                `${activeIncident.location.lat.toFixed(4)}, ${activeIncident.location.lng.toFixed(4)}`}
            </span>
          </div>
          
          <div className="flex gap-2 mt-3">
            <Button size="sm" className="w-full">View Details</Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full text-slate-300 border-slate-700 hover:bg-slate-800/60 hover:text-white"
            >
              Get Directions
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;