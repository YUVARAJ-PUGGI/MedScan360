
'use server';

import { db } from '@/lib/firebase';
import type { OpdSlipData } from '@/lib/schemas';
import { collection, addDoc } from 'firebase/firestore';

/**
 * Saves a generated OPD slip to the 'opdSlips' collection in Firestore.
 * @param slipData The OPD slip data to save.
 * @returns The ID of the newly created document.
 */
export async function saveOpdSlip(slipData: OpdSlipData): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'opdSlips'), slipData);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Could not save OPD slip to Firestore.");
  }
}
