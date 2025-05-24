
import { z } from 'zod';

export const patientRegistrationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.coerce.number().int().positive({ message: "Age must be a positive number." }),
  gender: z.enum(['male', 'female', 'other'], { message: "Please select a gender." }),
  bloodGroup: z.string().min(1, { message: "Blood group is required." }),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
  emergencyContactName: z.string().min(2, { message: "Emergency contact name is required." }),
  emergencyContactPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format." }),
  facialImagePreview: z.string().optional(), // For storing data URL of the image
});

export type PatientRegistrationFormData = z.infer<typeof patientRegistrationSchema>;

export const emergencyAdmissionSchema = z.object({
  patientId: z.string(),
  admissionNotes: z.string().optional(),
  consentGiven: z.boolean().refine(val => val === true, { message: "Consent must be given." }),
  dateTime: z.string().datetime(),
  name: z.string(),
  age: z.number(),
  bloodGroup: z.string(),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
});

export type EmergencyAdmissionFormData = z.infer<typeof emergencyAdmissionSchema>;

// Patient data structure for use across the app
export interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: string; // Consider enum if strict values are needed elsewhere
  bloodGroup: string;
  allergies: string; // Optional string
  medicalConditions: string; // Optional string
  emergencyContactName: string;
  emergencyContactPhone: string;
  faceImageUrl?: string; // URL to stored image (data URL or actual URL)
  // Fields like 'eta' or live 'location' are not part of registration
  // and would typically come from a different source (e.g. ambulance tracking system)
}
