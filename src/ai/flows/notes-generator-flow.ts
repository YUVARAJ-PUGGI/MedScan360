
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
import { z } from 'genkit';

// Define the input schema using Zod
export const NoteGeneratorInputSchema = z.object({
  keywords: z.string().describe('A comma-separated list of keywords or phrases from a patient consultation.'),
});
export type NoteGeneratorInput = z.infer<typeof NoteGeneratorInputSchema>;

// Define the output schema using Zod
export const NoteGeneratorOutputSchema = z.object({
  note: z.string().describe('The structured clinical note generated based on the keywords.'),
});
export type NoteGeneratorOutput = z.infer<typeof NoteGeneratorOutputSchema>;

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

      The note should be professional, concise, and organized into the following sections:
      - Subjective: Patient's reported complaints.
      - Objective: Simulated observations (e.g., "On examination...").
      - Assessment: A possible assessment based on the keywords.
      - Plan: Suggested next steps.

      Always include a disclaimer at the end stating that the note is an AI-generated draft
      and requires review by a qualified medical professional.

      Keywords provided: {{{keywords}}}

      Generate the note.
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
