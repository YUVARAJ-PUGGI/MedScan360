
'use server';
/**
 * @fileOverview A Genkit flow for generating and managing OPD (Outpatient Department) slips.
 *
 * - generateOpdSlip - Generates an OPD slip for a patient and (conceptually) stores it.
 * - GenerateOpdSlipInput - The input type for the generateOpdSlip function.
 * - OpdSlipData - The return type representing the generated OPD slip.
 */

import { ai } from '@/ai/genkit';
import { type PatientData, OpdSlipDataSchema, type OpdSlipData, GenerateOpdSlipInputSchema, type GenerateOpdSlipInput } from '@/lib/schemas';
import { z } from 'genkit';

function generateTokenNumber(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.random().toString().slice(2, 8); // 6 random digits
  return `OPD-${datePart}-${randomPart}`;
}

// Exported function to be called from the frontend
export async function generateOpdSlip(input: GenerateOpdSlipInput): Promise<OpdSlipData> {
  return generateOpdSlipFlow(input);
}

const generateOpdSlipFlow = ai.defineFlow(
  {
    name: 'generateOpdSlipFlow',
    inputSchema: GenerateOpdSlipInputSchema,
    outputSchema: OpdSlipDataSchema,
  },
  async (input) => {
    const { patient } = input;
    const currentDate = new Date().toISOString();
    const token = generateTokenNumber();

    const opdSlip: OpdSlipData = {
      id: `opdslip-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`, // Unique ID for the slip itself
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      tokenNumber: token,
      slipDate: currentDate,
      department: "General Medicine", // Example, can be made dynamic
      // doctorName: "Dr. A. Smith", // Example
    };

    // TODO: Implement Firebase Integration for Storage
    // Here you would use the Firebase Admin SDK (if running in a Node.js backend environment)
    // or Firebase Client SDK (if this flow were callable directly from client with appropriate rules)
    // to save the `opdSlip` data to Firestore or Realtime Database.
    // Example (conceptual, requires Firebase setup):
    //
    // import { getFirestore } from 'firebase-admin/firestore'; // If using Firebase Admin
    // const db = getFirestore();
    // await db.collection('opdSlips').doc(opdSlip.id).set(opdSlip);
    // console.log(`OPD Slip ${opdSlip.id} for patient ${opdSlip.patientId} (conceptually) stored in Firebase.`);

    console.log("Generated OPD Slip Data:", opdSlip);
    console.log("IMPORTANT: Firebase storage is not implemented in this flow. The above data is not saved to any database yet.");


    // For now, the flow just returns the generated slip data.
    // The frontend will receive this and can display it.
    // Actual persistence needs to be handled by integrating Firebase SDK calls above.
    return opdSlip;
  }
);
