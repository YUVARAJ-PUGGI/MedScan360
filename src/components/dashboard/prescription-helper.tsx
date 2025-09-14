
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Pill } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import type { PatientData } from '@/lib/schemas';

interface PrescriptionHelperProps {
    patient: PatientData | null;
}

export default function PrescriptionHelper({ patient }: PrescriptionHelperProps) {
  const [diagnosis, setDiagnosis] = useState('');
  const [generatedPrescription, setGeneratedPrescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePrescription = async () => {
    if (!diagnosis) return;
    setIsLoading(true);
    setGeneratedPrescription('');
    
    // Simulate AI call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setGeneratedPrescription(`
Patient Name: ${patient?.name || 'N/A'}
Patient Age: ${patient?.age || 'N/A'}
Date: ${new Date().toLocaleDateString()}

Diagnosis: ${diagnosis}

---

Rx:

1.  Medication Name: Paracetamol
    Dosage: 500mg
    Frequency: Twice a day after meals
    Duration: 3 days

2.  Medication Name: Ibuprofen
    Dosage: 200mg
    Frequency: As needed for pain, max 3 times a day.
    Duration: 5 days

Advice:
- Get adequate rest.
- Stay hydrated.
- Follow up if symptoms persist after 3 days.

---
(This is a placeholder AI-generated prescription. Review carefully.)
    `);
    setIsLoading(false);
  };

  return (
    <Card className="border-primary/50">
      <CardHeader>
        <div className="flex items-center gap-3">
            <Pill className="w-6 h-6 text-primary" />
            <CardTitle>AI Prescription Helper</CardTitle>
        </div>
        <CardDescription>
          Enter a diagnosis to get a draft prescription with common medications and dosages.
           {patient && ` (Selected Patient: ${patient.name})`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="e.g., Viral Fever"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        />
        <Button onClick={handleGeneratePrescription} disabled={isLoading || !diagnosis}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Draft...
            </>
          ) : (
             <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Prescription Draft
            </>
          )}
        </Button>
        {generatedPrescription && (
            <Card className="bg-muted/50 p-4">
                <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-lg">Draft Prescription</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Textarea value={generatedPrescription} readOnly rows={15} className="bg-background font-mono text-xs"/>
                </CardContent>
            </Card>
        )}
      </CardContent>
    </Card>
  );
}
