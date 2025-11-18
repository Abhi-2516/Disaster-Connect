// src/pages/Map.jsx
import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';

// Make sure these files exist:
// - src/components/LeafletMapView.jsx  (the Leaflet map component we discussed)
// - src/lib/leafletIconFix.js          (the icon fix helper)
import '@/lib/leafletIconFix'; // ensures marker icons load correctly with Vite
import 'leaflet/dist/leaflet.css'; // safe to import here if not in main.jsx

import LeafletMapView from '@/components/LeafletMapView';

// Try to import your incident store. If the path is different in your project, update it.
import { useIncidentStore } from '@/lib/store';

import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';

export default function MapPage() {
  // safe store access: if import exists and is a function, call it; otherwise fallback
  const incidentStore = typeof useIncidentStore === 'function' ? useIncidentStore() : null;
  const incidents = incidentStore?.incidents || [];

  // active incident when user clicks a marker
  const [activeIncident, setActiveIncident] = useState(null);

  // memoize incidents to avoid re-renders
  const memoIncidents = useMemo(() => incidents || [], [incidents]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col container mx-auto px-4 py-6">
        <div className="mb-4 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Live Incident Map</h1>
            <p className="text-slate-400 mt-1">Real-time disaster tracking and response coordination</p>
          </div>
        </div>

        <div className="relative flex-1 w-full min-h-[600px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
          {/* LeafletMapView handles markers, tooltip (hover) and click events.
              onMarkerClick will set activeIncident (so we can render the card). */}
          <LeafletMapView
            incidents={memoIncidents}
            onMarkerClick={(incident) => setActiveIncident(incident)}
            activeIncidentId={activeIncident?._id || activeIncident?.id}
          />

          {/* Active Incident Card (same visual as before) */}
          {activeIncident && (
            <div
              className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-10
                         bg-slate-900/95 backdrop-blur-md border border-slate-700/60
                         rounded-lg p-5 shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-white leading-tight">{activeIncident.title}</h3>
                  <div className="text-sm text-slate-400 mt-1">{activeIncident.type} • {activeIncident.severity}</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 -mr-2 -mt-2 text-slate-400 hover:text-white hover:bg-slate-800"
                  onClick={() => setActiveIncident(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-slate-300 mb-4 leading-relaxed line-clamp-3">
                {activeIncident.description}
              </p>

              <div className="flex items-center text-xs text-slate-400 mb-4 bg-slate-800/50 p-2 rounded">
                <MapPin className="h-3.5 w-3.5 mr-2 text-indigo-400" />
                <span className="font-mono">
                  {activeIncident.location?.address ||
                    (activeIncident.location?.lat && activeIncident.location?.lng
                      ? `${Number(activeIncident.location.lat).toFixed(4)}, ${Number(activeIncident.location.lng).toFixed(4)}`
                      : 'Unknown location')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20">
                  View Report
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                  onClick={() => {
                    // Center the map on the active incident by dispatching a custom event.
                    // LeafletMapView can listen for this event if you want programmatic centering.
                    // Alternatively, you can extend LeafletMapView to accept a 'centerOn' prop.
                    window.dispatchEvent(new CustomEvent('center-map-on', {
                      detail: {
                        lat: activeIncident.location?.lat,
                        lng: activeIncident.location?.lng,
                        zoom: 16
                      }
                    }));
                  }}
                >
                  Locate on Map
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
