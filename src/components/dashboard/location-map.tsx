
"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2, AlertTriangle, Users, UserCircle, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface PatientLocation {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  condition?: string;
}

interface LocationMapProps {
  initialPatients?: PatientLocation[];
  showUserLocation?: boolean;
  mapHeight?: string;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 20.5937, // Default to center of India if no location available
  lng: 78.9629,
};

export function LocationMap({ initialPatients, showUserLocation = false, mapHeight = "500px" }: LocationMapProps) {
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [trackedPatients, setTrackedPatients] = useState<PatientLocation[]>(initialPatients || []);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const { toast } = useToast();

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!googleMapsApiKey || googleMapsApiKey === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
      const apiKeyError = "Google Maps API key is missing or invalid. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env file.";
      setError(apiKeyError);
      toast({ title: "Map Configuration Error", description: apiKeyError, variant: "destructive" });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    if (initialPatients && initialPatients.length > 0) {
      setTrackedPatients(initialPatients);
    } else {
      setTrackedPatients([]);
    }

    if (showUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentCoords(userCoords);
          setError(null);
          if (!initialPatients || initialPatients.length === 0) {
            // If only showing user location, center map on them
            // setMapCenter(userCoords); 
          }
          setIsLoading(false);
        },
        (err) => {
          console.warn(`Error getting current location: ${err.message}`);
          const geoError = `Could not get your current location: ${err.message}. Please ensure location services are enabled.`;
          setError(geoError);
          // Don't toast here if API key is also an issue, to avoid double toasting.
          // toast({ title: "Location Error", description: geoError, variant: "destructive"});
          setIsLoading(false);
        }
      );
    } else if (showUserLocation) {
      const noGeoLocationMsg = "Geolocation is not supported by this browser or is disabled.";
      setError(noGeoLocationMsg);
      // toast({ title: "Location Error", description: noGeoLocationMsg, variant: "destructive"});
      setIsLoading(false);
    } else {
      setIsLoading(false); 
    }
  }, [initialPatients, toast, showUserLocation, googleMapsApiKey]);

  // Simulate real-time updates for tracked patients (if any)
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

  const mapTitle = showUserLocation ? "Your Current Location" : "Live Locations";
  const mapDescription = showUserLocation
    ? "Showing your current location via browser geolocation."
    : (trackedPatients.length > 0
      ? "Real-time tracking of entities."
      : "No live tracking data available.");

  const mapCenter = currentCoords || (trackedPatients.length > 0 ? trackedPatients[0].location : defaultCenter);
  
  const onMapLoad = useCallback(() => {
    setMapReady(true);
  }, []);


  if (!googleMapsApiKey || googleMapsApiKey === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
     return (
      <Card className="h-[600px] flex flex-col shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-destructive" />
            <CardTitle>Map Unavailable</CardTitle>
          </div>
          <CardDescription>Google Maps API key is missing or invalid.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          <div className="text-center p-6 bg-destructive/10 text-destructive rounded-md">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
            <p className="font-semibold">Configuration Error</p>
            <p>Please provide a valid Google Maps API key in the <code>.env</code> file as <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> and restart the application.</p>
          </div>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="flex flex-col shadow-md" style={{ height: mapHeight }}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <CardTitle>{mapTitle}</CardTitle>
        </div>
        <CardDescription>{mapDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow relative p-0">
        {isLoading && !mapReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg">Loading Map...</p>
            {showUserLocation && <p className="text-sm text-muted-foreground">Fetching your location...</p>}
          </div>
        )}
        {error && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10 text-destructive p-6 z-20">
            <WifiOff className="h-12 w-12 mb-4" />
            <p className="text-lg font-semibold">Map Data Error</p>
            <p className="text-center text-sm">{error}</p>
          </div>
        )}
        
        <LoadScript
          googleMapsApiKey={googleMapsApiKey!}
          libraries={['places']} // Add other libraries if needed, e.g. 'drawing', 'visualization'
          loadingElement={ 
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-10">
                <Loader2 className="h-10 w-10 animate-spin text-primary"/> 
                <p className="text-muted-foreground mt-2">Initializing Google Maps...</p>
            </div>
          }
          onError={(e) => {
              const scriptError = "Failed to load Google Maps script. Check your API key and network connection.";
              setError(scriptError);
              toast({ title: "Map Load Error", description: scriptError, variant: "destructive"});
              setIsLoading(false);
          }}
        >
          <GoogleMap
            mapContainerStyle={{...containerStyle, height: '100%'}}
            center={mapCenter}
            zoom={currentCoords || trackedPatients.length > 0 ? 15 : 5} // Zoom in if we have a specific point
            onLoad={onMapLoad}
            options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
            }}
          >
            {showUserLocation && currentCoords && (
              <Marker
                position={currentCoords}
                title="Your Location"
                icon={{
                  url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#007bff" width="36px" height="36px"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'),
                  scaledSize: new window.google.maps.Size(36, 36),
                  anchor: new window.google.maps.Point(18, 36),
                }}
              />
            )}
            {!showUserLocation && trackedPatients.map(patient => (
              <Marker
                key={patient.id}
                position={patient.location}
                title={patient.name}
                // You can customize patient markers, e.g., different colors based on condition
              />
            ))}
          </GoogleMap>
        </LoadScript>
         {mapReady && !isLoading && !error && (trackedPatients.length > 0 || currentCoords) && (
            <div className="absolute bottom-2 left-2 bg-background/80 p-2 rounded-md shadow-md max-w-xs text-xs">
                {showUserLocation && currentCoords && (
                    <p><UserCircle className="inline h-4 w-4 mr-1 text-blue-500"/>Your Location: Lat {currentCoords.lat.toFixed(4)}, Lng {currentCoords.lng.toFixed(4)}</p>
                )}
                {!showUserLocation && trackedPatients.length > 0 && (
                    <>
                        <p className="font-semibold mb-1"><Users className="inline h-4 w-4 mr-1"/>Tracked Entities:</p>
                        <ul className="max-h-20 overflow-y-auto">
                            {trackedPatients.map(p => <li key={p.id}>{p.name}</li>)}
                        </ul>
                    </>
                )}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
