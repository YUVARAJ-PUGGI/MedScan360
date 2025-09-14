
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Stethoscope } from 'lucide-react';
import type { PatientData } from '@/lib/schemas';

interface SymptomCheckerProps {
    patient: PatientData | null;
}

export default function SymptomChecker({ patient }: SymptomCheckerProps) {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckSymptoms = async () => {
    if (!symptoms) return;
    setIsLoading(true);
    setResult('');
    
    // Simulate AI call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setResult(`Based on the symptoms provided for ${patient?.name || 'the patient'}, possible considerations include: common cold, flu, or allergies. It is recommended to consult with the appropriate specialist. This is a placeholder response.`);
    setIsLoading(false);
  };

  return (
    <Card className="border-primary/50">
      <CardHeader>
        <div className="flex items-center gap-3">
            <Stethoscope className="w-6 h-6 text-primary" />
            <CardTitle>AI Symptom Checker</CardTitle>
        </div>
        <CardDescription>
            Enter patient symptoms to get a preliminary analysis and potential department suggestions.
            {patient && ` (Selected Patient: ${patient.name})`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="e.g., Patient reports high fever, persistent cough, and headache for the last 3 days..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={5}
        />
        <Button onClick={handleCheckSymptoms} disabled={isLoading || !symptoms}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
             <>
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze Symptoms
            </>
          )}
        </Button>
        {result && (
            <Card className="bg-muted/50 p-4">
                <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-lg">Analysis Result</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <p className="text-sm">{result}</p>
                </CardContent>
            </Card>
        )}
      </CardContent>
    </Card>
  );
}
