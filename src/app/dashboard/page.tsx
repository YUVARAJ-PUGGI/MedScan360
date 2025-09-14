
"use client"; // Required because we're using hooks like useState and useContext

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientList } from "@/components/dashboard/patient-list";
import { PatientDetailsView } from "@/components/dashboard/patient-details-view";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, ListChecks, UserCog, Bot } from "lucide-react";
import { usePatientData } from '@/context/PatientDataContext'; // Import context hook
import type { PatientData } from '@/lib/schemas';
import SymptomChecker from '@/components/dashboard/symptom-checker';
import ReportSummarizer from '@/components/dashboard/report-summarizer';
import NotesGenerator from '@/components/dashboard/notes-generator';
import PrescriptionHelper from '@/components/dashboard/prescription-helper';


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
            Overview of registered patients and clinical assistance tools.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 gap-2">
          <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
            <ListChecks className="h-5 w-5" /> Patient Overview
          </TabsTrigger>
           <TabsTrigger value="details" className="flex items-center gap-2 py-3 md:hidden"> {/* Show on mobile */}
            <UserCog className="h-5 w-5" /> Patient Details
          </TabsTrigger>
           <TabsTrigger value="ai_tools" className="flex items-center gap-2 py-3">
            <Bot className="h-5 w-5" /> AI Clinical Tools
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

        <TabsContent value="ai_tools" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot className="h-6 w-6"/>AI Clinical Tools</CardTitle>
                    <CardDescription>Use AI-powered tools to assist with clinical tasks.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="symptom_checker" className="w-full">
                        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                            <TabsTrigger value="symptom_checker">Symptom Checker</TabsTrigger>
                            <TabsTrigger value="report_summarizer">Report Summarizer</TabsTrigger>
                            <TabsTrigger value="notes_generator">Notes Generator</TabsTrigger>
                            <TabsTrigger value="prescription_helper">Prescription Helper</TabsTrigger>
                        </TabsList>
                        <TabsContent value="symptom_checker" className="mt-4">
                            <SymptomChecker />
                        </TabsContent>
                        <TabsContent value="report_summarizer" className="mt-4">
                            <ReportSummarizer />
                        </TabsContent>
                        <TabsContent value="notes_generator" className="mt-4">
                            <NotesGenerator />
                        </TabsContent>
                        <TabsContent value="prescription_helper" className="mt-4">
                            <PrescriptionHelper />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
