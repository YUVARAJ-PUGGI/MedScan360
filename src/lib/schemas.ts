import { z } from 'zod';

export const patientRegistrationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.coerce.number().int().positive({ message: "Age must be a positive number." }),
  gender: z.enum(['male', 'female', 'other'], { message: "Please select a gender." }),
  bloodGroup: z.string().min(1, { message: "Blood group is required." }), // Could be enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
  emergencyContactName: z.string().min(2, { message: "Emergency contact name is required." }),
  emergencyContactPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format." }),
  facialImage: z.any().optional() // Will be File object, handle validation separately if needed
});

export type PatientRegistrationFormData = z.infer<typeof patientRegistrationSchema>;

export const emergencyAdmissionSchema = z.object({
  patientId: z.string(),
  admissionNotes: z.string().optional(),
  consentGiven: z.boolean().refine(val => val === true, { message: "Consent must be given." }),
  dateTime: z.string().datetime(),
  // Add more fields as needed from the patient data to confirm/edit
  name: z.string(),
  age: z.number(),
  bloodGroup: z.string(),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
});

export type EmergencyAdmissionFormData = z.infer<typeof emergencyAdmissionSchema>;

// Dummy patient data structure
export interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  allergies: string;
  medicalConditions: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  faceImageUrl?: string; // URL to stored image
}
