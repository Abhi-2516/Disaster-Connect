import { 
  AlertTriangle, 
  Clock, 
  Flame, 
  MapPin, 
  ShieldAlert, 
  ThumbsUp, 
  Waves 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

// --- NEW HELPER FUNCTION ---
// Generates a dynamic placeholder image URL based on the incident
const getPlaceholderUrl = (incident) => {
  const title = encodeURIComponent(incident.title);
  let color = '5A9EFF'; // Default (blue)
  let textColor = 'ffffff';

  switch (incident.type) {
    case 'fire':
      color = 'FF5A5A'; // Red
      break;
    case 'earthquake':
    case 'landslide':
      color = 'FFAA5A'; // Amber
      break;
    case 'flood':
    case 'tsunami':
      color = '5A9EFF'; // Blue
      break;
  }

  return `https://placehold.co/600x400/${color}/${textColor}?text=${title}&font=inter`;
};
// --- END OF NEW FUNCTION ---

const IncidentCard = ({ incident, compact = false }) => {
  
  // Map incident type to icon
  const getTypeIcon = () => {
    switch (incident.type) {
      case 'fire':
        return <Flame className="h-4 w-4 text-red-400" />;
      case 'flood':
        return <Waves className="h-4 w-4 text-blue-400" />;
      case 'earthquake':
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-slate-400" />;
    }
  };

  // Get severity color classes
  const getSeverityClasses = () => {
    switch (incident.severity) {
      case 'high':
        return {
          badge: 'text-red-400 border-red-500/30 bg-red-900/30',
          hover: 'hover:border-red-500/50 hover:shadow-red-500/10'
        };
      case 'medium':
        return {
          badge: 'text-amber-400 border-amber-500/30 bg-amber-900/30',
          hover: 'hover:border-amber-500/50 hover:shadow-amber-500/10'
        };
      case 'low':
        return {
          badge: 'text-blue-400 border-blue-500/30 bg-blue-900/30',
          hover: 'hover:border-blue-500/50 hover:shadow-blue-500/10'
        };
      default:
        return {
          badge: 'text-slate-400 border-slate-700 bg-slate-800',
          hover: 'hover:border-primary/50'
        };
    }
  };

  // --- NEW onERROR HANDLER ---
  const handleImageError = (e) => {
    // This function triggers if the src={imageUrl} fails
    // It replaces the broken image with our dynamic placeholder
    e.target.onerror = null; // Prevents infinite loops
    e.target.src = getPlaceholderUrl(incident);
  };
  // --- END OF NEW HANDLER ---

  const severityClasses = getSeverityClasses();
  
  // --- UPDATED LOGIC ---
  // 1. Define the path to your new default image in the /public folder
  const defaultImageUrl = '/images/c1.jpg'; 
  
  // 2. Use incident.imageUrl first, then your default, then the placeholder (in onError)
  const imageUrl = incident.imageUrl || defaultImageUrl;
  // --- END OF UPDATED LOGIC ---


  return (
    <Card 
      className={`relative overflow-hidden transition-all duration-300 rounded-xl
        bg-slate-800/40 backdrop-blur-md border border-slate-700/60
        hover:shadow-2xl transform hover:-translate-y-1
        ${severityClasses.hover} ${compact ? 'h-[260px]' : ''}`}
    >
      {/* This check is now better. It will show the image container 
        even if imageUrl is missing, and let the placeholder logic handle it.
      */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} // --- THIS IS NOW USING THE CORRECT LOGIC ---
          alt={incident.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
          loading="lazy"
          onError={handleImageError} // If 'imageUrl' AND 'defaultImageUrl' fail, this runs
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/10"></div>
        
        {incident.verified && (
          <Badge 
            variant="secondary" 
            className="absolute top-3 right-3 bg-slate-950/70 backdrop-blur-sm border-0 flex items-center gap-1 text-primary-foreground"
          >
            <ShieldAlert className="h-3 w-3 text-primary" />
            Verified
          </Badge>
        )}
      </div>
      
      <CardContent className={compact ? 'pt-4 pb-2' : 'pt-6 pb-4'}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className={`font-semibold text-white text-balance ${compact ? 'text-base' : 'text-lg'}`}>
            {incident.title}
          </h3>
          
          <Badge variant="outline" className={`shrink-0 capitalize ${severityClasses.badge}`}>
            {incident.severity}
          </Badge>
        </div>
        
        <div className="flex items-center text-sm text-slate-400 mb-3">
          <Clock className="h-3.5 w-3.5 mr-1.5" />
          <span>
            {formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}
          </span>
        </div>
        
        {!compact && (
          <p className="text-sm text-slate-400 mb-3 line-clamp-2">
            {incident.description}
          </p>
        )}
        
        <div className="flex items-center text-sm text-slate-300">
          <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" />
          <span className="truncate">
            {incident.location.address || `${incident.location.lat.toFixed(2)}, ${incident.location.lng.toFixed(2)}`}
          </span>
        </div>
      </CardContent>
      
      <CardFooter 
        className={`flex justify-between items-center border-t border-slate-700/60 ${compact ? 'pt-2 pb-3' : 'pt-3 pb-4'}`}
      >
        <Badge 
          variant="outline" 
          className="flex items-center gap-1.5 border-slate-700 bg-slate-800/50 text-slate-300"
        >
          {getTypeIcon()}
          {incident.type.charAt(0).toUpperCase() + incident.type.slice(1)}
        </Badge>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs gap-1.5 h-8 text-slate-400 hover:text-white hover:bg-slate-700/50"
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          Helpful
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IncidentCard;