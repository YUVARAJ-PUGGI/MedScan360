
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input';
import { Loader2, Pilcrow } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '../ui/textarea';

export default function PrescriptionHelper() {
  const [diagnosis, setDiagnosis] = useState('');
  const [generatedPrescription, setGeneratedPrescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!diagnosis.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a diagnosis.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setGeneratedPrescription('');

    // Simulate AI call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulated AI response
    const simulatedResponse = `
Based on the diagnosis of "${diagnosis}", here is a draft prescription suggestion:

1. Medication: [Simulated Medication Name, e.g., Amoxicillin]
   Dosage: [e.g., 500mg]
   Frequency: [e.g., Twice a day for 7 days]

2. Medication: [Simulated Medication Name, e.g., Paracetamol]
   Dosage: [e.g., 500mg]
   Frequency: [e.g., As needed for pain or fever, up to 4 times a day]

Advice:
- Complete the full course of antibiotics.
- Ensure adequate rest and hydration.
- Follow up if symptoms do not improve.

---
Disclaimer: This is an AI-generated suggestion. The attending physician must verify all details, including drug names, dosages, and contraindications before issuing the final prescription.
    `.trim();
    
    setGeneratedPrescription(simulatedResponse);
    setIsLoading(false);
    toast({
      title: "Prescription Draft Generated",
      description: "A draft has been created based on the diagnosis.",
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>AI Prescription Helper</CardTitle>
        <CardDescription>
          Enter a diagnosis to get an AI-generated draft of a potential prescription and advice.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            placeholder="e.g., 'Acute Bronchitis'"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <Button onClick={handleGenerate} disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Pilcrow className="mr-2 h-4 w-4" />
              Generate Prescription Draft
            </>
          )}
        </Button>
        {generatedPrescription && (
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Generated Draft:</h4>
            <Textarea
              value={generatedPrescription}
              readOnly
              rows={12}
              className="bg-muted/50 font-mono text-xs"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
