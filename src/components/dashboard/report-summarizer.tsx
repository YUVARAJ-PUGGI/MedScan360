
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, BookText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ReportSummarizer() {
  const [reportText, setReportText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (!reportText.trim()) {
      toast({
        title: "Input Required",
        description: "Please paste or enter a medical report to summarize.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSummary('');

    // Simulate AI call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulated AI response
    const simulatedSummary = `
**Key Findings:**
- [Simulated key finding 1 based on report text]
- [Simulated key finding 2 based on report text]

**Conclusion/Diagnosis:**
- [Simulated conclusion, e.g., "Signs consistent with community-acquired pneumonia."]

**Recommendations:**
- [Simulated recommendation, e.g., "Suggest starting a course of antibiotics and follow-up imaging in 2 weeks."]

---
Disclaimer: This is an AI-generated summary and should not replace a full review of the original report by a qualified professional.
    `.trim();
    
    setSummary(simulatedSummary);
    setIsLoading(false);
    toast({
      title: "Summary Generated",
      description: "The medical report has been summarized.",
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>AI Medical Report Summarizer</CardTitle>
        <CardDescription>
          Paste a lengthy medical report below, and the AI will generate a concise summary.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            placeholder="Paste the full medical report text here..."
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            rows={10}
            disabled={isLoading}
          />
        </div>
        <Button onClick={handleSummarize} disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Summarizing...
            </>
          ) : (
            <>
              <BookText className="mr-2 h-4 w-4" />
              Summarize Report
            </>
          )}
        </Button>
        {summary && (
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Generated Summary:</h4>
            <div className="p-4 bg-muted/50 rounded-md border text-sm whitespace-pre-wrap">
              {summary}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
