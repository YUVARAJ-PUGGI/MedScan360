
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateNote } from '@/ai/flows/notes-generator-flow';
import type { NoteGeneratorOutput } from '@/lib/schemas';

export default function NotesGenerator() {
  const [keywords, setKeywords] = useState('');
  const [generatedNote, setGeneratedNote] = useState<NoteGeneratorOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async ().
    <content><![CDATA[
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateNote } from '@/ai/flows/notes-generator-flow';
import type { NoteGeneratorOutput } from '@/lib/schemas';

export default function NotesGenerator() {
  const [keywords, setKeywords] = useState('');
  const [generatedNote, setGeneratedNote] = useState<NoteGeneratorOutput | null>(null);
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
    setGeneratedNote(null);

    try {
      const result = await generateNote({ keywords });
      setGeneratedNote(result);
      toast({
        title: "Note Generated",
        description: "A draft of the doctor's note has been created.",
      });
    } catch(error) {
      console.error("Note Generation Error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Generation Failed",
        description: `Could not generate note: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
              value={generatedNote.note}
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
