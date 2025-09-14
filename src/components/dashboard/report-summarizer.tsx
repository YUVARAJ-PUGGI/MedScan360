
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, BookText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { summarizeReport } from '@/ai/flows/report-summarizer-flow';
import type { ReportSummarizerOutput } from '@/lib/schemas';

export default function ReportSummarizer() {
  const [reportText, setReportText] = useState('');
  const [summary, setSummary] = useState<ReportSummarizerOutput | null>(null);
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
    setSummary(null);

    try {
      const result = await summarizeReport({ reportText });
      setSummary(result);
      toast({
        title: "Summary Generated",
        description: "The medical report has been summarized.",
      });
    } catch(error) {
      console.error("Report Summarization Error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Summarization Failed",
        description: `Could not summarize report: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
              {summary.summary}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
