
'use server';
/**
 * @fileOverview A Genkit flow for analyzing patient symptoms.
 *
 * - analyzeSymptoms - Analyzes patient symptoms to provide a preliminary analysis.
 * - SymptomAnalysisInput - The input type for the analyzeSymptoms function.
 * - SymptomAnalysisOutput - The return type representing the symptom analysis.
 */

import { ai } from '@/ai/genkit';
import { SymptomAnalysisInputSchema, type SymptomAnalysisInput, SymptomAnalysisOutputSchema, type SymptomAnalysisOutput } from '@/lib/schemas';


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
