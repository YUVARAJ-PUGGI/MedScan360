
"use client"; // Required because we're using hooks like useState and useContext

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientList } from "@/components/dashboard/patient-list";
import { PatientDetailsView } from "@/components/dashboard/patient-details-view";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, ListChecks, UserCog } from "lucide-react";
import { usePatientData } from '@/context/PatientDataContext'; // Import context hook
import type { PatientData } from '@/lib/schemas';

export default function DashboardPage() {
  const { patients, getPatientById } = usePatientData(); // Get patients from context
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState<PatientData | null>(null);

  // Effect to set initial selected patient or update when patients list changes
  useEffect(() => {
    if (!selectedPatientId && patients.length > 0) {
      setSelectedPatientId(patients[0].id);
    } else if (selectedPatientId && !patients.find(p => p.id === selectedPatientId) && patients.length > 0) {
      // If current selected patient is no longer in the list (e.g. data reset), select first
      setSelectedPatientId(patients[0].id);
    } else if (patients.length === 0) {
      setSelectedPatientId(null); // No patients, no selection
    }
  }, [patients, selectedPatientId]);

  // Effect to update details view when selectedPatientId changes
  useEffect(() => {
    if (selectedPatientId) {
      const patient = getPatientById(selectedPatientId);
      setSelectedPatientForDetails(patient || null);
    } else {
      setSelectedPatientForDetails(null);
    }
  }, [selectedPatientId, getPatientById]);

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl">Doctor Dashboard</CardTitle>
          </div>
          <CardDescription className="text-md">
            Overview of registered patients and patient management tools.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-1 gap-2">
          <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
            <ListChecks className="h-5 w-5" /> Patient Overview
          </TabsTrigger>
           <TabsTrigger value="details" className="flex items-center gap-2 py-3 md:hidden"> {/* Show on mobile */}
            <UserCog className="h-5 w-5" /> Patient Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <PatientList 
                patients={patients} 
                onSelectPatient={handleSelectPatient} 
                selectedPatientId={selectedPatientId}
              />
            </div>
            <div className="lg:col-span-2 hidden md:block">
              <PatientDetailsView patient={selectedPatientForDetails} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="mt-6 md:hidden"> {/* Show only on mobile */}
           <PatientDetailsView patient={selectedPatientForDetails} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
