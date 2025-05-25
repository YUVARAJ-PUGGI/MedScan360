
"use client";

import { LocationMap } from '@/components/dashboard/location-map';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from 'lucide-react';
import { usePatientData } from '@/context/PatientDataContext';
import { useState, useEffect } from 'react';
import type { PatientData } from '@/lib/schemas';

// Simulate fetching a specific patient's (or ambulance's) live location data
// In a real app, this would come from a real-time database or API
function getMockLivePatientLocation(): PatientData | null {
  // For demonstration, pick a random registered patient if available, or create a mock one
  // This is just to show some data on the map.
  const mockId = `live-${Date.now()}`;
  return {
    id: mockId,
    name: 'Live Tracked Patient Alpha', // Generic name
    age: 0, // Not relevant for map marker
    gender: '', // Not relevant for map marker
    bloodGroup: '', // Not relevant
    allergies: '', // Not relevant
    medicalConditions: 'En route to hospital', // Could be status
    emergencyContactName: '', // Not relevant
    emergencyContactPhone: '', // Not relevant
    // Provide some initial coordinates - e.g. around a city center
    // These will be "updated" by the LocationMap's internal simulation
    // In a real app, these coords would be fetched live.
    // Example: San Francisco coordinates
    // location: { lat: 37.7749 + (Math.random() - 0.5) * 0.05, lng: -122.4194 + (Math.random() - 0.5) * 0.05 },
  };
  // If you want to use actual registered patients:
  // const { patients } = usePatientData(); // This hook can't be used at top level of a module
  // if (patients.length > 0) return { ...patients[0], location: ... };
  // return null;
}


export default function LiveLocationPage() {
  const { patients: registeredPatients } = usePatientData();
  const [trackedPatientForMap, setTrackedPatientForMap] = useState<any[]>([]);

  useEffect(() => {
    // Simulate fetching a specific patient to track.
    // In a real scenario, you might get a patient ID from URL params,
    // or the user might select a patient to track.
    let patientToTrack: PatientData | null = null;

    if (registeredPatients.length > 0) {
      // For demo: pick the first registered patient if available and give them a dynamic location
      patientToTrack = {
        ...registeredPatients[0],
        // @ts-ignore
        location: {
          lat: 37.7749 + (Math.random() - 0.5) * 0.01, // Example: San Francisco area
          lng: -122.4194 + (Math.random() - 0.5) * 0.01,
        }
      };
    } else {
      // Fallback to a generic mock patient if no one is registered
      const mockPatient = getMockLivePatientLocation();
      if (mockPatient) {
         // @ts-ignore
        patientToTrack = {
            ...mockPatient,
             // @ts-ignore
            location: {
                lat: 37.7749 + (Math.random() - 0.5) * 0.01,
                lng: -122.4194 + (Math.random() - 0.5) * 0.01,
            }
        }
      }
    }
    
    if (patientToTrack) {
      setTrackedPatientForMap([patientToTrack]);
    } else {
      setTrackedPatientForMap([]);
    }
  }, [registeredPatients]);

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Navigation className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl">Live Patient Location</CardTitle>
          </div>
          <CardDescription className="text-md">
            Track the real-time location of the patient or emergency vehicle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LocationMap initialPatients={trackedPatientForMap} /> 
           <p className="mt-4 text-sm text-muted-foreground text-center">
            Note: This map shows a simulated live location. Real-time tracking requires integration with GPS data sources from the patient or vehicle.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
