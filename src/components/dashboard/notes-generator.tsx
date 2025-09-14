
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function NotesGenerator() {
  const [keywords, setKeywords] = useState('');
  const [generatedNote, setGeneratedNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!keywords.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some keywords or phrases.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setGeneratedNote('');

    // Simulate AI call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulated AI response
    const simulatedResponse = `
Patient presented with complaints of: ${keywords}. 
On examination, [Simulated observation based on keywords]. 
Assessment: [Simulated assessment]. 
Plan: [Simulated plan, e.g., recommend rest, hydration, and follow-up in 3 days if symptoms persist].

---
Disclaimer: This is an AI-generated draft and requires review and finalization by a qualified medical professional.
    `.trim();
    
    setGeneratedNote(simulatedResponse);
    setIsLoading(false);
    toast({
      title: "Note Generated",
      description: "A draft of the doctor's note has been created.",
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>AI Doctor's Note Generator</CardTitle>
        <CardDescription>
          Enter keywords or short phrases about the consultation, and the AI will generate a structured note.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            placeholder="e.g., 'headache for 2 days, sensitivity to light, no fever'"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            rows={3}
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
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Note
            </>
          )}
        </Button>
        {generatedNote && (
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Generated Note:</h4>
            <Textarea
              value={generatedNote}
              readOnly
              rows={8}
              className="bg-muted/50"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
