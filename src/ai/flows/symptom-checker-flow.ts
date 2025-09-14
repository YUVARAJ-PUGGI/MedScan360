
'use server';
/**
 * @fileOverview A Genkit flow for analyzing patient symptoms.
 *
 * - analyzeSymptoms - Analyzes patient symptoms to provide a preliminary analysis.
 * - SymptomAnalysisInput - The input type for the analyzeSymptoms function.
 * - SymptomAnalysisOutput - The return type representing the symptom analysis.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the input schema for the symptom analysis flow
export const SymptomAnalysisInputSchema = z.object({
  symptoms: z.string().describe('A description of the patient\'s symptoms.'),
  patientName: z.string().optional().describe('The name of the patient.'),
});
export type SymptomAnalysisInput = z.infer<typeof SymptomAnalysisInputSchema>;

// Define the output schema for the symptom analysis flow
export const SymptomAnalysisOutputSchema = z.object({
  analysis: z.string().describe('A preliminary analysis of the symptoms, including potential conditions and recommended next steps or specialists.'),
});
export type SymptomAnalysisOutput = z.infer<typeof SymptomAnalysisOutputSchema>;


// Exported function to be called from the frontend
export async function analyzeSymptoms(input: SymptomAnalysisInput): Promise<SymptomAnalysisOutput> {
  return symptomAnalysisFlow(input);
}


const prompt = ai.definePrompt({
  name: 'symptomAnalysisPrompt',
  input: { schema: SymptomAnalysisInputSchema },
  output: { schema: SymptomAnalysisOutputSchema },
  prompt: `You are an AI medical assistant. Your role is to provide a preliminary analysis of patient symptoms for a qualified medical professional.

Analyze the following symptoms for the patient{{#if patientName}}, {{patientName}}{{/if}}.

Symptoms:
"{{symptoms}}"

Based on these symptoms, provide a brief analysis. Include a list of potential (but not definitive) considerations or conditions. Suggest which type of medical department or specialist might be appropriate for a consultation.

IMPORTANT: Frame your response as a preliminary analysis for a doctor to review. Do not provide a definitive diagnosis. Start your analysis with "Based on the reported symptoms...".
`,
});


const symptomAnalysisFlow = ai.defineFlow(
  {
    name: 'symptomAnalysisFlow',
    inputSchema: SymptomAnalysisInputSchema,
    outputSchema: SymptomAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("The AI model did not return a valid analysis.");
    }
    return output;
  }
);
