// Converted to .jsx (removed IncidentFeedProps, types on state and functions)
// - Replaced 'glass' with the new dark-mode glassmorphism style
//   (bg-slate-800/40, backdrop-blur-md, border-slate-700/60).
// - Styled the <Input> and <Select> components to match the dark theme.
// - Adjusted text colors (e.g., text-muted-foreground -> text-slate-400) for dark mode.
// - Kept all functionality, state, and filtering/sorting logic identical.

import { useState } from 'react';
// Incident type removed
import IncidentCard from './IncidentCard';
import RangeSelector from './RangeSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search, XCircle } from 'lucide-react'; 
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIncidentStore } from '@/lib/store';

// IncidentFeedProps interface removed
const IncidentFeed = ({ userLocation }) => {
  const { incidents } = useIncidentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [radius, setRadius] = useState(50);
  const [incidentType, setIncidentType] = useState('all'); // type removed
  const [sortBy, setSortBy] = useState('recent'); // type removed
  
  // Filter incidents based on search, radius, and type
  const filteredIncidents = incidents.filter(incident => {
    // Search filter
    const matchesSearch = 
      searchTerm === '' || 
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = 
      incidentType === 'all' || 
      incident.type === incidentType;
    
    // Radius filter (only if userLocation is available and radius is not global)
    let matchesRadius = true;
    if (userLocation && radius !== -1) {
      const distance = calculateDistance(
        userLocation.lat, 
        userLocation.lng,
        incident.location.lat,
        incident.location.lng
      );
      matchesRadius = distance <= radius;
    }
    
    return matchesSearch && matchesType && matchesRadius;
  });
  
  // Sort incidents
  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    if (sortBy === 'recent') {
      return b.timestamp.getTime() - a.timestamp.getTime();
    } else if (sortBy === 'severity') {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      // @ts-ignore removed
      return severityOrder[b.severity] - severityOrder[a.severity];
    }
    return 0;
  });

  // Calculate distance between two points (Haversine formula)
  function calculateDistance(lat1, lon1, lat2, lon2) { // types removed
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  }
  
  function deg2rad(deg) { // type removed
    return deg * (Math.PI/180);
  }

  const resetFilters = () => {
    setSearchTerm('');
    setIncidentType('all');
    setRadius(-1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search incidents by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-11 bg-slate-800/60 border-slate-700/80 rounded-lg placeholder:text-slate-400 focus:bg-slate-800 focus:border-primary"
          />
        </div>
        
        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Range Selector */}
          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/60 rounded-xl p-4">
            <RangeSelector
              value={radius}
              onChange={setRadius}
              showGlobal={true}
            />
          </div>
          
          {/* Type Filter */}
          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/60 rounded-xl p-4 space-y-3">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium text-slate-200">Filter By Type</h3>
            </div>
            <Select 
              value={incidentType} 
              onValueChange={setIncidentType}
            >
              <SelectTrigger className="w-full bg-slate-800/60 border-slate-700 text-slate-300 focus:ring-primary">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="flood">Flood</SelectItem>
                <SelectItem value="fire">Fire</SelectItem>
                <SelectItem value="earthquake">Earthquake</SelectItem>
                <SelectItem value="hurricane">Hurricane</SelectItem>
                <SelectItem value="tornado">Tornado</SelectItem>
                <SelectItem value="landslide">Landslide</SelectItem>
                <SelectItem value="tsunami">Tsunami</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Sort By */}
          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/60 rounded-xl p-4 space-y-3">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium text-slate-200">Sort By</h3>
            </div>
            <Select 
              value={sortBy} 
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-full bg-slate-800/60 border-slate-700 text-slate-300 focus:ring-primary">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="severity">Severity (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Incident Grid */}
      {sortedIncidents.length > 0 ? (
        <>
          <div className="text-sm text-slate-400">
            Showing {sortedIncidents.length} incident{sortedIncidents.length !== 1 ? 's' : ''}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedIncidents.map((incident, index) => (
              <div 
                key={incident.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
              >
                <IncidentCard incident={incident} />
              </div>
            ))}
          </div>
        </>
      ) : (
        // No Results
        <div className="text-center py-16 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
          <XCircle className="h-12 w-12 mx-auto text-slate-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No incidents match your filters</h3>
          <p className="text-slate-400 mb-6">
            Try adjusting your search criteria or expanding your radius
          </p>
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="text-slate-300 border-slate-700 hover:bg-slate-800/60 hover:text-white"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default IncidentFeed;