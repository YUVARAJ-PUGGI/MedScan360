
"use client";

import { LocationMap } from '@/components/dashboard/location-map';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from 'lucide-react';
// Removed usePatientData and related state as we are focusing on showing user's location
// import { usePatientData } from '@/context/PatientDataContext';
// import { useState, useEffect } from 'react';
// import type { PatientData } from '@/lib/schemas';

export default function LiveLocationPage() {
  // Removed logic for fetching registered patients or mock patients for tracking
  // The LocationMap component will now handle showing the user's own location via geolocation

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Navigation className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl">Your Live Location (Demo)</CardTitle>
          </div>
          <CardDescription className="text-md">
            This page attempts to display your current location using your browser's geolocation feature.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Pass showUserLocation={true} to the LocationMap */}
          <LocationMap initialPatients={[]} showUserLocation={true} /> 
           <p className="mt-4 text-sm text-muted-foreground text-center">
            Note: This map shows your browser-reported location for demonstration. 
            Accuracy depends on your device and browser settings. 
            Real-time tracking of other entities would require different data sources.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

