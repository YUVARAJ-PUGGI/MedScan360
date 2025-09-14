
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, FileText } from 'lucide-react';

export default function ReportSummarizer() {
  const [reportText, setReportText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    if (!reportText) return;
    setIsLoading(true);
    setSummary('');
    
    // Simulate AI call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSummary('The patient underwent a series of tests which showed normal results. The key finding was a minor inflammation, treated with medication. Follow-up is advised in two weeks. This is a placeholder summary.');
    setIsLoading(false);
  };

  return (
    <Card className="border-primary/50">
      <CardHeader>
        <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-primary" />
            <CardTitle>AI Medical Report Summarizer</CardTitle>
        </div>
        <CardDescription>
          Paste a lengthy medical report to generate a concise summary of key findings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste the full medical report text here..."
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          rows={8}
        />
        <Button onClick={handleSummarize} disabled={isLoading || !reportText}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Summarizing...
            </>
          ) : (
             <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Summary
            </>
          )}
        </Button>
        {summary && (
            <Card className="bg-muted/50 p-4">
                <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-lg">Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <p className="text-sm">{summary}</p>
                </CardContent>
            </Card>
        )}
      </CardContent>
    </Card>
  );
}
