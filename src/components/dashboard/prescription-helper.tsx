
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Loader2, Pilcrow, Pill, Lightbulb, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generatePrescription } from '@/ai/flows/prescription-helper-flow';
import type { PrescriptionHelperOutput } from '@/lib/schemas';
import { Separator } from '../ui/separator';

// Simple parser to extract sections from the generated text
function parsePrescription(text: string) {
    const sections = {
        medications: [] as string[],
        advice: [] as string[],
        disclaimer: ''
    };

    // A very basic parser assuming the AI follows a somewhat predictable format.
    const lines = text.split('\n').filter(line => line.trim() !== '');

    let currentSection: 'meds' | 'advice' | 'disclaimer' | null = null;

    for (const line of lines) {
        const lowerLine = line.toLowerCase();
        if (lowerLine.includes('medication')) {
            currentSection = 'meds';
            continue;
        } else if (lowerLine.includes('advice')) {
            currentSection = 'advice';
            continue;
        } else if (lowerLine.includes('disclaimer')) {
            currentSection = 'disclaimer';
            // Capture multi-line disclaimer
            const disclaimerIndex = text.toLowerCase().indexOf('disclaimer');
            if (disclaimerIndex !== -1) {
                sections.disclaimer = text.substring(disclaimerIndex);
            }
            break; // Disclaimer is assumed to be last
        }

        if (currentSection === 'meds' && (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('-'))) {
            sections.medications.push(line.substring(2).trim());
        } else if (currentSection === 'advice' && (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('-'))) {
            sections.advice.push(line.substring(2).trim());
        }
    }
    
    // Fallback if parsing is weak
    if (sections.medications.length === 0 && sections.advice.length === 0 && !sections.disclaimer) {
        return { ...sections, disclaimer: text };
    }


    return sections;
}


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

  const parsedResult = generatedPrescription ? parsePrescription(generatedPrescription.prescription) : null;

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
        {parsedResult && (
          <div className="pt-4 border-t space-y-4">
            <h3 className="text-xl font-bold text-primary">Generated Draft</h3>
            
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2"><Pill className="h-5 w-5 text-primary"/>Medication Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside space-y-2">
                        {parsedResult.medications.map((med, index) => (
                            <li key={index}>{med}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary"/>General Advice</CardTitle>
                </CardHeader>
                <CardContent>
                     <ul className="list-disc list-inside space-y-2">
                        {parsedResult.advice.map((adv, index) => (
                            <li key={index}>{adv}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            
            <Separator />

             <div className="p-3 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-md text-sm flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="whitespace-pre-wrap">{parsedResult.disclaimer}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
