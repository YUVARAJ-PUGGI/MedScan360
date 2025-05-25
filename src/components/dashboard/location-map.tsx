
"use client";

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2, WifiOff, Users, Info, UserCircle } from 'lucide-react'; // Added UserCircle
import { useToast } from '@/hooks/use-toast';

interface PatientLocation {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  condition?: string;
}

interface LocationMapProps {
  initialPatients?: PatientLocation[];
  showUserLocation?: boolean; // New prop to control showing user location
}

export function LocationMap({ initialPatients, showUserLocation = false }: LocationMapProps) {
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [trackedPatients, setTrackedPatients] = useState<PatientLocation[]>(initialPatients || []);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    if (initialPatients && initialPatients.length > 0) {
        setTrackedPatients(initialPatients);
    } else {
        setTrackedPatients([]);
    }
    

    if (showUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setError(null);
          setIsLoading(false);
        },
        (err) => {
          console.warn(`Error getting current location: ${err.message}`);
          setError(`Could not get your current location: ${err.message}. Please ensure location services are enabled for your browser and this site.`);
          toast({ title: "Location Error", description: `Could not get current location: ${err.message}.`, variant: "destructive"});
          setIsLoading(false);
        }
      );
    } else if (showUserLocation) {
      const noGeoLocationMsg = "Geolocation is not supported by this browser or is disabled.";
      setError(noGeoLocationMsg);
      toast({ title: "Location Error", description: noGeoLocationMsg, variant: "destructive"});
      setIsLoading(false);
    } else {
        setIsLoading(false); // Not showing user location, so stop loading
    }
  }, [initialPatients, toast, showUserLocation]);

  // Simulate real-time updates for tracked patients
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (trackedPatients.length > 0) {
      intervalId = setInterval(() => {
        setTrackedPatients(prevPatients => 
          prevPatients.map(p => ({
            ...p,
            location: {
              lat: p.location.lat + (Math.random() - 0.5) * 0.001,
              lng: p.location.lng + (Math.random() - 0.5) * 0.001,
            }
          }))
        );
      }, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [trackedPatients]);


  const mapTitle = showUserLocation ? "Your Current Location (Demo)" : "Live Ambulance Locations";
  const mapDescription = showUserLocation 
    ? "This is a demonstration of fetching your browser's location." 
    : (trackedPatients.length > 0 
        ? "Real-time tracking of incoming emergency vehicles."
        : "No live vehicle tracking data available currently.");

  return (
    <Card className="h-[600px] flex flex-col shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <CardTitle>{mapTitle}</CardTitle>
        </div>
        <CardDescription>{mapDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow relative p-0">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg">Loading Map Data...</p>
            {showUserLocation && <p className="text-sm text-muted-foreground">Attempting to fetch your location...</p>}
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10 text-destructive p-6 z-10">
            <WifiOff className="h-12 w-12 mb-4" />
            <p className="text-lg font-semibold">Map Unavailable</p>
            <p className="text-center">{error}</p>
          </div>
        ) : (
          <div ref={mapRef} className="w-full h-full bg-muted rounded-b-lg relative overflow-hidden">
            {/* Simulated Map Background */}
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 opacity-50">
                {/* You could add some generic grid lines or patterns here */}
            </div>
            
            <div className="p-4 h-full flex flex-col items-center justify-center relative z-1">
              {showUserLocation && currentCoords && (
                <div className="text-center mb-6 p-4 bg-background/80 rounded-lg shadow-lg">
                  <UserCircle className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                  <p className="text-xl font-semibold text-foreground">Your Location (Approx.)</p>
                  <p className="text-sm text-muted-foreground">
                    Lat: {currentCoords.lat.toFixed(4)}, Lng: {currentCoords.lng.toFixed(4)}
                  </p>
                   <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">(Browser Geolocation)</p>
                </div>
              )}
               {!showUserLocation && trackedPatients.length === 0 && !currentCoords && (
                 <div className="text-center">
                    <MapPin className="h-16 w-16 text-primary/50 mb-4" />
                    <p className="text-xl font-semibold text-muted-foreground">Map Area</p>
                 </div>
               )}


              {trackedPatients.length > 0 ? (
                <div className="mt-4 p-3 bg-background/80 rounded-md shadow max-h-40 overflow-y-auto w-full max-w-md">
                  <h4 className="font-semibold text-sm mb-1 flex items-center"><Users className="h-4 w-4 mr-1.5"/>Tracked Vehicles:</h4>
                  <ul className="text-xs space-y-0.5">
                    {trackedPatients.map(p => (
                      <li key={p.id}>{p.name}: Lat {p.location.lat.toFixed(3)}, Lng {p.location.lng.toFixed(3)}</li>
                    ))}
                  </ul>
                </div>
              ) : !showUserLocation && (
                <div className="mt-4 p-3 bg-background/80 rounded-md shadow w-full max-w-md text-center">
                  <Info className="h-6 w-6 mx-auto mb-2 text-primary"/>
                  <p className="text-sm text-muted-foreground">No vehicles are currently being tracked live.</p>
                </div>
              )}
              
               <div className="absolute bottom-4 left-4 right-4 p-3 bg-yellow-100 dark:bg-yellow-800 border border-yellow-300 dark:border-yellow-700 rounded-md text-xs text-yellow-700 dark:text-yellow-300 text-center">
                <Info className="inline h-4 w-4 mr-1" />
                This is a **demo map**. A real Google Maps integration requires an API key and the Google Maps SDK.
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

