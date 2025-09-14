
'use server';
/**
 * @fileOverview A Genkit flow for generating doctor's notes from keywords.
 *
 * This file defines a Genkit flow that takes keywords related to a patient
 * consultation and generates a structured clinical note.
 *
 * - generateNote - The primary exported function to be called from the client.
 */

import { ai } from '@/ai/genkit';
import { 
    NoteGeneratorInputSchema, 
    NoteGeneratorOutputSchema,
    type NoteGeneratorInput,
    type NoteGeneratorOutput 
} from '@/lib/schemas';

// Exported function to be called from the frontend
export async function generateNote(input: NoteGeneratorInput): Promise<NoteGeneratorOutput> {
  return notesGeneratorFlow(input);
}

const notesGeneratorPrompt = ai.definePrompt(
  {
    name: 'notesGeneratorPrompt',
    input: { schema: NoteGeneratorInputSchema },
    output: { schema: NoteGeneratorOutputSchema },

    // The core prompt that instructs the AI model.
    prompt: `
      You are an AI assistant for a doctor. Your task is to generate a structured clinical note
      based on a list of keywords and phrases from a patient consultation.

      The note must be professional, concise, and strictly organized into the following sections
      which you will populate into the structured output format:
      - subjective: Patient's reported complaints (e.g., "Patient reports...").
      - objective: Simulated clinical observations (e.g., "On examination...").
      - assessment: A possible diagnosis or assessment based on the keywords.
      - plan: Suggested next steps, like tests or prescriptions.

      You must also generate a disclaimer stating that the note is an AI-generated draft
      and requires review by a qualified medical professional.

      Keywords provided: {{{keywords}}}

      Generate the structured note now.
    `,
  }
);

const notesGeneratorFlow = ai.defineFlow(
  {
    name: 'notesGeneratorFlow',
    inputSchema: NoteGeneratorInputSchema,
    outputSchema: NoteGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await notesGeneratorPrompt(input);
    if (!output) {
        throw new Error("Note generation failed to produce a valid output.");
    }
    // The flow returns the generated note which conforms to the output schema.
    return output;
  }
);

