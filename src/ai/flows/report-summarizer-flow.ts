
'use server';
/**
 * @fileOverview A Genkit flow for summarizing medical reports.
 *
 * This file defines a Genkit flow that takes the full text of a medical report
 * and generates a concise summary.
 *
 * - summarizeReport - The primary exported function to be called from the client.
 */

import { ai } from '@/ai/genkit';
import { 
    ReportSummarizerInputSchema, 
    ReportSummarizerOutputSchema,
    type ReportSummarizerInput,
    type ReportSummarizerOutput 
} from '@/lib/schemas';

// Exported function to be called from the frontend
export async function summarizeReport(input: ReportSummarizerInput): Promise<ReportSummarizerOutput> {
  return reportSummarizerFlow(input);
}

const reportSummarizerPrompt = ai.definePrompt(
  {
    name: 'reportSummarizerPrompt',
    input: { schema: ReportSummarizerInputSchema },
    output: { schema: ReportSummarizerOutputSchema },

    // The core prompt that instructs the AI model.
    prompt: `
      You are an AI assistant skilled in medical terminology and documentation. Your task is to
      summarize a lengthy medical report into a structured, easy-to-read format.

      The summary should highlight the most critical information and be organized into these sections:
      - **Key Findings**: Bullet points of the most important observations from the report.
      - **Conclusion/Diagnosis**: The final conclusion or diagnosis mentioned in the report.
      - **Recommendations**: Any recommended next steps, treatments, or follow-ups.

      Always include a disclaimer at the end stating that this is an AI-generated summary and
      should not replace a full review of the original report by a qualified professional.

      Medical report text to summarize:
      {{{reportText}}}

      Generate the summary.
    `,
  }
);

const reportSummarizerFlow = ai.defineFlow(
  {
    name: 'reportSummarizerFlow',
    inputSchema: ReportSummarizerInputSchema,
    outputSchema: ReportSummarizerOutputSchema,
  },
  async (input) => {
    const { output } = await reportSummarizerPrompt(input);
    if (!output) {
        throw new Error("Report summarization failed to produce a valid output.");
    }
    // The flow returns the generated summary.
    return output;
  }
);
