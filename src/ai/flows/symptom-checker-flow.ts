
'use server';
/**
 * @fileOverview A Genkit flow for analyzing patient symptoms.
 *
 * This file defines a Genkit flow that takes a patient's symptoms as input,
 * analyzes them using an AI model, and returns a preliminary analysis
 * including potential conditions and recommended next steps.
 *
 * - analyzeSymptoms - The primary exported function to be called from the client.
 */

import { ai } from '@/ai/genkit';
import { SymptomAnalysisInputSchema, SymptomAnalysisOutputSchema, type SymptomAnalysisInput, type SymptomAnalysisOutput } from '@/lib/schemas';

// Exported function to be called from the frontend
export async function analyzeSymptoms(input: SymptomAnalysisInput): Promise<SymptomAnalysisOutput> {
  return symptomAnalysisFlow(input);
}

const symptomAnalysisPrompt = ai.definePrompt(
  {
    name: 'symptomAnalysisPrompt',
    input: { schema: SymptomAnalysisInputSchema },
    output: { schema: SymptomAnalysisOutputSchema },

    // The core prompt that instructs the AI model.
    // It uses Handlebars {{...}} to insert input variables.
    prompt: `
      You are an AI-powered medical assistant integrated into a Doctor's Dashboard.
      Your role is to provide a preliminary analysis of patient symptoms to help the doctor with their diagnosis.

      IMPORTANT: You are providing preliminary insights, not a final diagnosis. Always include a disclaimer
      that this is an AI-generated analysis and should be verified by a qualified medical professional.

      Patient: {{patientName}}
      Symptoms: {{{symptoms}}}

      Based on the symptoms provided, please perform the following analysis:
      1.  **Potential Conditions**: List 2-3 potential medical conditions that could be associated with these symptoms, from most likely to least likely. For each, provide a brief, one-sentence explanation of why the symptoms are a match.
      2.  **Recommended Next Steps**: Suggest immediate next steps for the doctor, such as specific physical exams, lab tests (e.g., blood work, imaging), or questions to ask the patient.
      3.  **Recommended Specialist**: Suggest the type of medical specialist who would be most appropriate for a referral if needed (e.g., Cardiologist, Neurologist, Pulmonologist).

      Structure your entire response in a clear, easy-to-read format. Do not use markdown formatting like bold or lists in the final 'analysis' output string. Just use plain text with newlines.
    `,
  }
);

const symptomAnalysisFlow = ai.defineFlow(
  {
    name: 'symptomAnalysisFlow',
    inputSchema: SymptomAnalysisInputSchema,
    outputSchema: SymptomAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await symptomAnalysisPrompt(input);

    // The 'output' is guaranteed by the model to conform to the SymptomAnalysisOutputSchema
    // because we specified it in the prompt definition.
    if (!output) {
        throw new Error("Symptom analysis failed to generate a valid output.");
    }
    return output;
  }
);
