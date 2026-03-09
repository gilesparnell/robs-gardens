import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getPostcodesInBounds, SearchResult } from '@/lib/postcodes';
import { AlertCircle, HelpCircle, X } from 'lucide-react';

interface Zone {
  day: string;
  postcodes: string[];
  areas: string[];
  label: string;
}

interface ServiceArea {
  suburb: string;
  postcode: string;
  lat: number;
  lng: number;
}

interface SelectAreaMapProps {
  open: boolean;
  onClose: () => void;
  onSaveSelections: (selections: Map<string, Array<{suburb: string, postcode: string}>>) => void;
  schedule: Zone[];
}

const DAY_COLORS: Record<string, string> = {
  Monday: '#3b82f6',    // blue
  Tuesday: '#22c55e',   // green
  Wednesday: '#eab308', // yellow
  Thursday: '#ef4444',  // red
  Friday: '#a855f7',    // purple
};

// Owner's home location - Seaforth
const SEAFORTH = { lat: -33.7678, lng: 151.3088, zoom: 13 };

/**
 * Interactive map for selecting service areas
 * Shows all suburbs color-coded by service day
 * Click on a suburb to select it
 */
export function SelectAreaMap({
  open,
  onClose,
  onSaveSelections,
  schedule,
}: SelectAreaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedAreas, setSelectedAreas] = useState<Set<string>>(new Set());
  const [savedSelections, setSavedSelections] = useState<Map<string, Array<{suburb: string, postcode: string}>>>(new Map());
  const [showHelp, setShowHelp] = useState(true);
  const [visiblePostcodes, setVisiblePostcodes] = useState<SearchResult[]>([]);
  const [isLoadingPostcodes, setIsLoadingPostcodes] = useState(false);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const markerDataRef = useRef<Map<L.CircleMarker, {suburb: string, postcode: string}>>(new Map());

  // Helper function to load and display postcodes for current map bounds
  const loadPostcodesForMapBounds = async (map: L.Map) => {
    const bounds = map.getBounds();
    setIsLoadingPostcodes(true);

    try {
      const postcodes = await getPostcodesInBounds(
        bounds.getSouth(),
        bounds.getWest(),
        bounds.getNorth(),
        bounds.getEast()
      );

      setVisiblePostcodes(postcodes);

      // Clear old markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      markerDataRef.current.clear();

      // Add new markers for visible postcodes
      postcodes.forEach(postcode => {
        // Find which day this suburb is scheduled for
        const day = schedule.find(z =>
          z.areas.some(a => a.toLowerCase() === postcode.suburb.toLowerCase())
        )?.day;

        const color = day ? DAY_COLORS[day] : '#9ca3af'; // gray if not scheduled

        const marker = L.circleMarker([postcode.lat, postcode.lng], {
          radius: 6,
          fillColor: color,
          color: '#fff',
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.75,
        });

        marker.bindPopup(
          `<div class="text-sm font-medium">${postcode.suburb}</div>
           <div class="text-xs text-gray-600">${day || 'Not scheduled'}</div>
           <div class="text-xs text-gray-600">Postcode: ${postcode.postcode}</div>`
        );

        marker.on('click', () => {
          setSelectedAreas(prev => {
            const key = postcode.suburb;
            const newSet = new Set(prev);
            if (newSet.has(key)) {
              newSet.delete(key);
              marker.setStyle({ fillOpacity: 0.75 });
            } else {
              newSet.add(key);
              marker.setStyle({ fillOpacity: 1, weight: 2.5 });
            }
            return newSet;
          });
        });

        marker.addTo(map);
        markersRef.current.push(marker);
        markerDataRef.current.set(marker, { suburb: postcode.suburb, postcode: postcode.postcode });
      });
    } catch (error) {
      console.error('[SelectAreaMap] Failed to load postcodes:', error);
    } finally {
      setIsLoadingPostcodes(false);
    }
  };

  // Initialize map - ONLY when dialog opens, not when data changes
  // This deliberately excludes schedule from dependencies
  // to prevent re-initialization on every parent render (which breaks the map)
  // IMPORTANT: This is intentional. Do not add these to the dependency array.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!open) {
      // Clean up immediately when dialog closes
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
      markerDataRef.current.clear();
      return;
    }

    // Only initialize once when dialog first opens
    if (mapInstanceRef.current) {
      return; // Map already initialized
    }

    // Wait for DOM to be ready
    const initializeMapSafely = async () => {
      // Try multiple times with backoff to ensure DOM is ready
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        if (mapRef.current && mapRef.current.offsetHeight > 0) {
          // DOM is ready
          try {
            // Create map centered on Greater Sydney
            const map = L.map(mapRef.current).setView([-33.75, 151.0], 8);

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors',
              maxZoom: 19,
            }).addTo(map);

            // Load initial postcodes for current bounds
            await loadPostcodesForMapBounds(map);

            // Add event listeners for map movement/zoom
            map.on('moveend', () => loadPostcodesForMapBounds(map));
            map.on('zoomend', () => loadPostcodesForMapBounds(map));

            mapInstanceRef.current = map;
            return; // Success
          } catch (error) {
            console.error('[SelectAreaMap] Map initialization failed:', error);
            mapInstanceRef.current = null;
            return;
          }
        }

        // DOM not ready yet, try again
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.error('[SelectAreaMap] Map container not ready after retries');
    };

    initializeMapSafely();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
      markerDataRef.current.clear();
    };
  }, [open]); // ONLY depend on 'open' - this is the key fix!

  // Handle day selection - zoom to relevant area or Seaforth
  // Only depends on selectedDay to avoid re-triggering on postcode reloads
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedDay) return;

    // Find existing areas for this day in the schedule
    const dayZone = schedule.find(z => z.day === selectedDay);
    const hasExistingAreas = dayZone && dayZone.areas.length > 0;

    if (hasExistingAreas && dayZone && dayZone.areas.length > 0) {
      // Find postcodes for existing areas from the visible postcodes
      const firstExistingArea = visiblePostcodes.find(p =>
        dayZone!.areas.some(area => area.toLowerCase() === p.suburb.toLowerCase())
      );

      if (firstExistingArea) {
        mapInstanceRef.current.flyTo([firstExistingArea.lat, firstExistingArea.lng], 13, {
          duration: 1.5,
          easeLinearity: 0.5,
        });
        return;
      }
    }

    // No existing areas - default to Seaforth (owner's home)
    mapInstanceRef.current.flyTo([SEAFORTH.lat, SEAFORTH.lng], SEAFORTH.zoom, {
      duration: 1.5,
      easeLinearity: 0.5,
    });
  }, [selectedDay]);

  if (!open) return null;

  const handleSaveDay = () => {
    if (selectedDay && selectedAreas.size > 0) {
      const areas = Array.from(selectedAreas).map(suburb => {
        const data = Array.from(markerDataRef.current.values()).find(d => d.suburb === suburb);
        return data || { suburb, postcode: '' };
      });

      const newSaved = new Map(savedSelections);
      newSaved.set(selectedDay, areas);
      setSavedSelections(newSaved);

      // Reset for next day
      setSelectedDay(null);
      setSelectedAreas(new Set());
    }
  };

  const handleBack = () => {
    // Clean up map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    // Send all accumulated selections back to parent
    onSaveSelections(savedSelections);
    setSelectedDay(null);
    setSelectedAreas(new Set());
    setSavedSelections(new Map());
    onClose();
  };

  const handleDialogClose = (openState: boolean) => {
    if (!openState) {
      // Clean up when dialog closes
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      setSelectedDay(null);
      setSelectedAreas(new Set());
      setSavedSelections(new Map());
      setShowHelp(true);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Select Service Area from Map</DialogTitle>
        </DialogHeader>

        {/* Help Section */}
        {showHelp && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
            <div className="flex-1 text-sm text-amber-900">
              <p className="font-medium mb-1">Build your schedule by day:</p>
              <p className="text-xs leading-relaxed">Pick a service day → click markers to select areas → save the day. Repeat for other days → back to schedule to apply all changes.</p>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="text-amber-700 hover:text-amber-900 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-96">
          {/* Map */}
          <div className="lg:col-span-3 bg-gray-100 rounded-lg overflow-hidden h-96">
            <div
              ref={mapRef}
              className="w-full h-full"
              style={{ backgroundColor: '#f3f4f6', minHeight: '384px' }}
            />
          </div>

          {/* Legend & Selection Panel */}
          <div className="space-y-4 flex flex-col">
            {/* Legend */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-3">Service Days</h4>
              <div className="space-y-2">
                {Object.entries(DAY_COLORS).map(([day, color]) => {
                  const savedCount = savedSelections.get(day)?.length || 0;
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                      className={`w-full flex items-center gap-2 text-sm p-2 rounded transition-colors ${
                        selectedDay === day
                          ? 'bg-primary/20 border border-primary'
                          : savedCount > 0
                          ? 'bg-green/10 border border-green/20 hover:bg-green/15'
                          : 'hover:bg-background/50'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          selectedDay === day ? 'border-primary' : 'border-white'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                      <span className={selectedDay === day ? 'font-semibold' : ''}>
                        {day}
                        {savedCount > 0 && <span className="ml-1 text-xs text-green-700">✓ {savedCount}</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Areas Info */}
            {selectedDay && selectedAreas.size > 0 ? (
              <div className="bg-primary/10 border border-primary/30 p-4 rounded-lg max-h-48 overflow-y-auto">
                <div className="text-xs text-muted-foreground mb-2">Selected for {selectedDay}:</div>
                <div className="space-y-1 text-sm">
                  {Array.from(selectedAreas).map(area => (
                    <div key={area} className="font-medium text-primary">{area}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-muted p-4 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  {selectedDay ? 'Click markers to select areas' : 'Select a day first, then click markers'}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
              <p className="font-medium mb-1">Tips:</p>
              <ul className="space-y-1 list-disc list-inside text-xs">
                <li>Pick a service day</li>
                <li>Click markers to select</li>
                <li>Click again to deselect</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.remove();
              mapInstanceRef.current = null;
            }
            setSelectedDay(null);
            setSelectedAreas(new Set());
            setSavedSelections(new Map());
            onClose();
          }}>
            Cancel
          </Button>

          {savedSelections.size > 0 && (
            <Button onClick={handleBack} variant="default">
              Back to Schedule ({savedSelections.size} day{savedSelections.size !== 1 ? 's' : ''})
            </Button>
          )}

          <Button
            onClick={handleSaveDay}
            disabled={!selectedDay || selectedAreas.size === 0}
            variant={selectedDay && selectedAreas.size > 0 ? 'default' : 'secondary'}
          >
            {selectedDay ? `Save ${selectedDay} (${selectedAreas.size})` : 'Select a day & areas'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
