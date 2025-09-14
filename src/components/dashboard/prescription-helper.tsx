
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Loader2, Pilcrow } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { generatePrescription } from '@/ai/flows/prescription-helper-flow';
import type { PrescriptionHelperOutput } from '@/lib/schemas';

export default function PrescriptionHelper() {
  const [diagnosis, setDiagnosis] = useState('');
  const [generatedPrescription, setGeneratedPrescription] = useState<PrescriptionHelperOutput | null>(null);
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
    setGeneratedPrescription(null);

    try {
      const result = await generatePrescription({ diagnosis });
      setGeneratedPrescription(result);
      toast({
        title: "Prescription Draft Generated",
        description: "A draft has been created based on the diagnosis.",
      });
    } catch(error) {
        console.error("Prescription Generation Error:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        toast({
          title: "Generation Failed",
          description: `Could not generate prescription: ${errorMessage}`,
          variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
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
            value={ diagnosis }
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
              value={generatedPrescription.prescription}
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
