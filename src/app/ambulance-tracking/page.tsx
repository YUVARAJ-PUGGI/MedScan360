
"use client";

import { LocationMap } from '@/components/dashboard/location-map';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Track } from 'lucide-react';

export default function AmbulanceTrackingPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Track className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl">Live Ambulance Tracking</CardTitle>
          </div>
          <CardDescription className="text-md">
            This page shows a real-time simulation of an ambulance's location.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LocationMap trackAmbulance={true} mapHeight="calc(100vh - 22rem)" /> 
           <p className="mt-4 text-sm text-muted-foreground text-center">
            Note: This is a simulated ambulance for demonstration purposes. 
            A valid Google Maps API key is required for the map to function.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
