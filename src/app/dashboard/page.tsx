
"use client"; // Required because we're using hooks like useState and useContext

import { useState, useEffect } from 'react';
import { PatientList } from "@/components/dashboard/patient-list";
import { PatientDetailsView } from "@/components/dashboard/patient-details-view";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";
import { usePatientData } from '@/context/PatientDataContext'; // Import context hook
import type { PatientData } from '@/lib/schemas';

export default function DashboardPage() {
  const { patients, getPatientById } = usePatientData(); // Get patients from context
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);

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
      setSelectedPatient(patient || null);
    } else {
      setSelectedPatient(null);
    }
  }, [selectedPatientId, getPatientById, patients]); // Added `patients` to dependency array

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
            Manage patient records and generate clinical notes.
          </CardDescription>
        </CardHeader>
      </Card>

       <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PatientList 
            patients={patients} 
            onSelectPatient={handleSelectPatient} 
            selectedPatientId={selectedPatientId}
          />
        </div>
        <div className="lg:col-span-2">
          <PatientDetailsView patient={selectedPatient} />
        </div>
      </div>
    </div>
  );
}
