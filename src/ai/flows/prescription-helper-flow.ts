
'use server';
/**
 * @fileOverview A Genkit flow for generating prescription suggestions.
 *
 * This file defines a Genkit flow that takes a medical diagnosis and provides a
 * draft prescription suggestion.
 *
 * - generatePrescription - The primary exported function.
 */

import { ai } from '@/ai/genkit';
import { 
    PrescriptionHelperInputSchema, 
    PrescriptionHelperOutputSchema,
    type PrescriptionHelperInput,
    type PrescriptionHelperOutput 
} from '@/lib/schemas';

// Exported function to be called from the frontend
export async function generatePrescription(input: PrescriptionHelperInput): Promise<PrescriptionHelperOutput> {
  return prescriptionHelperFlow(input);
}

const prescriptionHelperPrompt = ai.definePrompt(
  {
    name: 'prescriptionHelperPrompt',
    input: { schema: PrescriptionHelperInputSchema },
    output: { schema: PrescriptionHelperOutputSchema },

    // The core prompt that instructs the AI model.
    prompt: `
      You are an AI assistant designed to help doctors by drafting prescription suggestions.
      Your suggestions should be based on common treatment guidelines for the provided diagnosis.

      The draft should include:
      1.  **Medication**: Suggest 1-2 common medications for the diagnosis.
      2.  **Dosage**: Provide a standard dosage (e.g., 500mg).
      3.  **Frequency**: Provide a standard frequency (e.g., Twice a day for 7 days).
      4.  **General Advice**: Include brief, non-pharmacological advice (e.g., rest, hydration).

      Crucially, you must ALWAYS include a prominent disclaimer that this is a draft suggestion
      and the attending physician must verify all details (drug names, dosages, patient allergies,
      contraindications) before issuing a final, official prescription.

      Diagnosis provided: {{{diagnosis}}}

      Generate the prescription draft.
    `,
  }
);

const prescriptionHelperFlow = ai.defineFlow(
  {
    name: 'prescriptionHelperFlow',
    inputSchema: PrescriptionHelperInputSchema,
    outputSchema: PrescriptionHelperOutputSchema,
  },
  async (input) => {
    const { output } = await prescriptionHelperPrompt(input);
    if (!output) {
        throw new Error("Prescription generation failed to produce a valid output.");
    }
    return output;
  }
);
