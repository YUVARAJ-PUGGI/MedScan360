
"use client";

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2, WifiOff, Users, Info } from 'lucide-react'; // Added Info
import { useToast } from '@/hooks/use-toast';

interface PatientLocation {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  condition?: string;
}

interface LocationMapProps {
  initialPatients?: PatientLocation[]; // Made optional
}

export function LocationMap({ initialPatients }: LocationMapProps) {
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
    setIsLoading(false);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setError(null);
        },
        (err) => {
          console.warn(`Error getting current location: ${err.message}`);
          setError(`Could not get current location: ${err.message}.`);
          toast({ title: "Location Error", description: err.message, variant: "destructive"});
        }
      );
    } else {
      const noGeoLocationMsg = "Geolocation is not supported by this browser.";
      setError(noGeoLocationMsg);
      toast({ title: "Location Error", description: noGeoLocationMsg, variant: "destructive"});
    }
  }, [initialPatients, toast]);

  // Simulate real-time updates only if there are initial patients to track
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


  return (
    <Card className="h-[600px] flex flex-col shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <CardTitle>Live Ambulance Locations</CardTitle>
        </div>
        <CardDescription>
          {trackedPatients.length > 0 
            ? "Real-time tracking of incoming emergency vehicles."
            : "No live vehicle tracking data available currently."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow relative p-0">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg">Loading Map Data...</p>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10 text-destructive p-6 z-10">
            <WifiOff className="h-12 w-12 mb-4" />
            <p className="text-lg font-semibold">Map Unavailable</p>
            <p className="text-center">{error}</p>
          </div>
        ) : (
          <div ref={mapRef} className="w-full h-full bg-muted rounded-b-lg">
            <div className="p-4 h-full flex flex-col items-center justify-center">
              <MapPin className="h-16 w-16 text-primary/50 mb-4" />
              <p className="text-xl font-semibold text-muted-foreground">Map Area</p>
              <p className="text-sm text-muted-foreground mb-4">Google Maps integration would be here.</p>
              {currentCoords && (
                <p className="text-xs text-muted-foreground">
                  Your Location: Lat: {currentCoords.lat.toFixed(4)}, Lng: {currentCoords.lng.toFixed(4)}
                </p>
              )}
              {trackedPatients.length > 0 ? (
                <div className="mt-4 p-3 bg-background/70 rounded-md shadow max-h-40 overflow-y-auto w-full max-w-md">
                  <h4 className="font-semibold text-sm mb-1 flex items-center"><Users className="h-4 w-4 mr-1.5"/>Tracked Vehicles:</h4>
                  <ul className="text-xs space-y-0.5">
                    {trackedPatients.map(p => (
                      <li key={p.id}>{p.name}: Lat {p.location.lat.toFixed(3)}, Lng {p.location.lng.toFixed(3)}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-background/70 rounded-md shadow w-full max-w-md text-center">
                  <Info className="h-6 w-6 mx-auto mb-2 text-primary"/>
                  <p className="text-sm text-muted-foreground">No vehicles are currently being tracked live.</p>
                  <p className="text-xs text-muted-foreground">This map displays live ambulance locations when available.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
