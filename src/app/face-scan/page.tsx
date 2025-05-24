"use client";

import { useState } from 'react';
import WebcamCapture from '@/components/core/webcam-capture';
import EmergencyDisplay from '@/components/core/emergency-display';
import { type PatientData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ScanFace, ServerCrash, UserCheck, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

// Mock function to simulate API call
async function recognizeFaceAPI(imageDataUrl: string): Promise<PatientData | null> {
  console.log("Sending image data (first 50 chars):", imageDataUrl.substring(0, 50));
  await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate network latency

  // Simulate different outcomes
  const randomOutcome = Math.random();
  if (randomOutcome < 0.6) { // 60% chance of match
    return {
      id: `patient-${Date.now()}`,
      name: 'Jane Doe (Recognized)',
      age: 34,
      gender: 'Female',
      bloodGroup: 'O+',
      allergies: 'Penicillin, Bee stings',
      medicalConditions: 'Asthma, Hypertension',
      emergencyContactName: 'John Doe',
      emergencyContactPhone: '+19876543210',
      faceImageUrl: 'https://placehold.co/100x100.png', // Placeholder for actual image if available
    };
  } else if (randomOutcome < 0.85) { // 25% chance of no match
    return null;
  } else { // 15% chance of API error
    throw new Error("Simulated API error: Could not connect to recognition service.");
  }
}

export default function FaceScanPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [showWebcam, setShowWebcam] = useState(true);
  const { toast } = useToast();

  const handleCapture = async (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setShowWebcam(false); // Hide webcam after capture
    setIsLoading(true);
    setPatientData(null);
    setScanError(null);

    try {
      const data = await recognizeFaceAPI(imageSrc);
      if (data) {
        setPatientData(data);
        toast({
          title: "Patient Identified",
          description: `${data.name} recognized successfully.`,
          variant: "default",
        });
      } else {
        setScanError("No matching patient record found.");
        toast({
          title: "No Match",
          description: "The scanned face did not match any patient records.",
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during face scan.";
      setScanError(errorMessage);
      toast({
        title: "Scan Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetScan = () => {
    setCapturedImage(null);
    setPatientData(null);
    setIsLoading(false);
    setScanError(null);
    setShowWebcam(true);
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <ScanFace className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl">Emergency Face Scan</CardTitle>
          </div>
          <CardDescription className="text-md">
            Use the webcam to capture a facial image for patient identification.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {showWebcam && !capturedImage && (
            <WebcamCapture onCapture={handleCapture} captureButtonText="Scan Face"/>
          )}

          {capturedImage && (
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Captured Image:</h3>
              <Image 
                src={capturedImage} 
                alt="Captured face" 
                width={200} 
                height={200} 
                className="rounded-md border mx-auto mb-4 shadow-md" 
              />
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-md">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-3" />
              <p className="text-lg font-medium text-foreground">Scanning and Identifying...</p>
              <p className="text-sm text-muted-foreground">Please wait while we process the image.</p>
            </div>
          )}

          {scanError && !isLoading && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-md text-center space-y-3">
               <ServerCrash className="h-10 w-10 mx-auto mb-2" />
              <p className="text-xl font-semibold">Scan Failed</p>
              <p>{scanError}</p>
            </div>
          )}
          
          {patientData && !isLoading && (
            <div className="p-4 bg-green-500/10 text-green-700 dark:text-green-400 rounded-md text-center space-y-3">
              <UserCheck className="h-10 w-10 mx-auto mb-2 text-green-600 dark:text-green-500" />
              <p className="text-xl font-semibold">Patient Identified!</p>
              <EmergencyDisplay patient={patientData} />
            </div>
          )}

          {!patientData && !isLoading && !showWebcam && !scanError && (
             <div className="p-4 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-md text-center space-y-3">
                <UserX className="h-10 w-10 mx-auto mb-2 text-yellow-600 dark:text-yellow-500" />
                <p className="text-xl font-semibold">No Match Found</p>
                <p>The scanned image did not match any patient in our records.</p>
            </div>
          )}

          {(!showWebcam || scanError) && (
            <Button onClick={resetScan} variant="outline" className="w-full">
              Scan Another Face
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
