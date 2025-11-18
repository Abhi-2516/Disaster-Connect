
import { create } from 'zustand';
import { Incident } from '@/lib/types';


// India-focused demo incidents (replace existing mockIncidents with this)
const mockIncidents: Incident[] = [
  {
    id: 'in-1',
    title: 'Severe Flooding in Kochi Lowlands',
    description: 'Heavy monsoon rains caused localized flooding across low-lying areas. Several roads are submerged and rescue teams are assisting stranded residents.',
    type: 'flood',
    severity: 'high',
    location: {
      lat: 9.931233,     // Kochi
      lng: 76.267303,
      address: 'Ernakulam, Kochi, Kerala'
    },
    imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.t8reygShUxNZ6GXFRyKO9QHaEc?rs=1&pid=ImgDetMain&o=7&rm=3',
    reportedBy: 'user_kerala01',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    verified: true,
  },
  {
    id: 'in-2',
    title: 'Cyclone-related Storm Surge Near Puri Coast',
    description: 'Strong winds and elevated sea levels along the Puri coast have caused coastal flooding and damaged small fishing boats. Authorities have issued cautionary advisories.',
    type: 'cyclone',
    severity: 'high',
    location: {
      lat: 19.8135,     // Puri (approx)
      lng: 85.8312,
      address: 'Puri Coast, Odisha'
    },
    imageUrl: 'https://tse3.mm.bing.net/th/id/OIP.RYj4uo-7NMHT-57D1MFF_AHaFj?rs=1&pid=ImgDetMain&o=7&rm=3',
    reportedBy: 'user_odisha02',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    verified: true,
  },
  {
    id: 'in-3',
    title: 'Heatwave Medical Emergencies in Delhi',
    description: 'Multiple heat-related illness reports near central Delhi. Medical camps are being set up and public advisories warn of extreme daytime temperatures.',
    type: 'heatwave',
    severity: 'medium',
    location: {
      lat: 28.704060,   // New Delhi
      lng: 77.102493,
      address: 'Connaught Place, New Delhi, Delhi'
    },
    imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.V0CoMhmBNQdlM7CtRbWWFAHaDt?rs=1&pid=ImgDetMain&o=7&rm=3',
    reportedBy: 'user_delhi03',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    verified: false,
  },
  {
    id: 'in-4',
    title: 'Landslide Blocks Mountain Highway near Manali',
    description: 'A landslide has blocked a stretch of the Kullu-Manali highway after heavy rainfall. Traffic is stalled and local authorities are arranging clearance operations.',
    type: 'landslide',
    severity: 'high',
    location: {
      lat: 32.243186,   // near Manali / Kullu region
      lng: 77.189223,
      address: 'Kullu-Manali Highway, Himachal Pradesh'
    },
    imageUrl: 'https://www.tribuneindia.com/sortd-service/imaginary/v22-01/jpg/large/high?url=dGhldHJpYnVuZS1zb3J0ZC1wcm8tcHJvZC1zb3J0ZC9tZWRpYTkxNDgwMTIwLTYwZjMtMTFmMC05MTIyLTg5YjRhMjgyZWQzNS5qcGc=',
    reportedBy: 'user_hp04',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    verified: true,
  },
  {
    id: 'in-5',
    title: 'Large Fire in Industrial Area, Mumbai',
    description: 'A blaze reported in an industrial warehouse in suburban Mumbai. Fire units are on site; nearby roads are closed for emergency access.',
    type: 'fire',
    severity: 'high',
    location: {
      lat: 19.076090,   // Mumbai
      lng: 72.877426,
      address: 'Andheri Industrial Area, Mumbai, Maharashtra'
    },
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.xb7zNkZSRFCPnuEgyj-78QHaEJ?rs=1&pid=ImgDetMain&o=7&rm=3',
    reportedBy: 'user_mumbai05',
    timestamp: new Date(Date.now() - 1000 * 60 * 90), // 90 minutes ago
    verified: false,
  },
  {
    id: 'in-6',
    title: 'Train Derailment (Major) Near Bengaluru Outskirts',
    description: 'A short-distance passenger train derailed on the outskirts; services are delayed and emergency teams are inspecting carriages. No major casualties reported so far.',
    type: 'accident',
    severity: 'medium',
    location: {
      lat: 13.0110,     // area near Bengaluru (approx)
      lng: 77.5536,
      address: 'Yelahanka – outskirts of Bengaluru, Karnataka'
    },
    imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.hxVfnxyx4C_Es34-PcWv-gHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',
    reportedBy: 'user_bengaluru06',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    verified: false,
  },
  {
    id: 'in-7',
    title: 'Coastal Flooding & Road Closures in Chennai',
    description: 'High tide and heavy coastal rain has resulted in localized flooding and temporary road closures in low-lying Chennai neighborhoods.',
    type: 'flood',
    severity: 'medium',
    location: {
      lat: 13.082680,   // Chennai
      lng: 80.270718,
      address: 'Marina / Besant Nagar area, Chennai, Tamil Nadu'
    },
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.0XD72ZyE02ePOhLN7cQZ7wHaEK?rs=1&pid=ImgDetMain&o=7&rm=3',
    reportedBy: 'user_chennai07',
    timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
    verified: true,
  }
];


interface IncidentStore {
  incidents: Incident[];
  addIncident: (incident: Omit<Incident, 'id' | 'timestamp' | 'reportedBy' | 'verified'>) => void;
  getIncidentById: (id: string) => Incident | undefined;
}

export const useIncidentStore = create<IncidentStore>((set, get) => ({
  incidents: mockIncidents,
  
  addIncident: (incidentData) => {
    const newIncident: Incident = {
      ...incidentData,
      id: Date.now().toString(),
      timestamp: new Date(),
      reportedBy: 'currentUser', // In a real app, this would be the logged-in user's ID
      verified: false,
    };
    
    set((state) => ({
      incidents: [newIncident, ...state.incidents]
    }));
    
    return newIncident;
  },
  
  getIncidentById: (id) => {
    return get().incidents.find(incident => incident.id === id);
  }
}));
export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(' ');
}
