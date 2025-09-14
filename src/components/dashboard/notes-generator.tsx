
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Pencil } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import type { PatientData } from '@/lib/schemas';

interface NotesGeneratorProps {
    patient: PatientData | null;
}

export default function NotesGenerator({ patient }: NotesGeneratorProps) {
  const [keywords, setKeywords] = useState('');
  const [generatedNotes, setGeneratedNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateNotes = async () => {
    if (!keywords) return;
    setIsLoading(true);
    setGeneratedNotes('');
    
    // Simulate AI call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setGeneratedNotes(`Patient: ${patient?.name || 'N/A'}\n\nDate: ${new Date().toLocaleDateString()}\n\nChief Complaint:\nBased on the keyword "${keywords}", the patient presented with relevant symptoms.\n\nObjective Findings:\nA physical examination was conducted, revealing findings consistent with the chief complaint.\n\nAssessment:\nA preliminary diagnosis was made.\n\nPlan:\nThe patient was advised on a course of treatment and a follow-up was scheduled. This is a placeholder note.`);
    setIsLoading(false);
  };

  return (
    <Card className="border-primary/50">
      <CardHeader>
        <div className="flex items-center gap-3">
            <Pencil className="w-6 h-6 text-primary" />
            <CardTitle>AI Doctor's Notes Generator</CardTitle>
        </div>
        <CardDescription>
          Enter keywords or short phrases about the consultation to generate a formal note.
          {patient && ` (Selected Patient: ${patient.name})`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="e.g., headache, rest, hydration"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <Button onClick={handleGenerateNotes} disabled={isLoading || !keywords}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
             <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Notes
            </>
          )}
        </Button>
        {generatedNotes && (
            <Card className="bg-muted/50 p-4">
                <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-lg">Generated Notes</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Textarea value={generatedNotes} readOnly rows={10} className="bg-background"/>
                </CardContent>
            </Card>
        )}
      </CardContent>
    </Card>
  );
}
