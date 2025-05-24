import { EmergencyAdmissionForm } from '@/components/forms/emergency-admission-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type PatientData } from '@/lib/schemas';
import { FileText } from 'lucide-react';

// Mock function to fetch patient data - replace with actual Firestore call
async function getPatientData(patientId: string): Promise<PatientData | null> {
  console.log("Fetching data for patientId:", patientId);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  // This is mock data. In a real app, fetch from Firestore.
  if (patientId.startsWith("patient-")) {
    return {
      id: patientId,
      name: 'Jane Doe (Fetched)',
      age: 34,
      gender: 'Female',
      bloodGroup: 'O+',
      allergies: 'Penicillin, Bee stings',
      medicalConditions: 'Asthma, Hypertension',
      emergencyContactName: 'John Doe',
      emergencyContactPhone: '+19876543210',
      faceImageUrl: 'https://placehold.co/100x100.png',
    };
  }
  return null;
}

export default async function EmergencyFormPage({ params }: { params: { patientId: string } }) {
  const patientData = await getPatientData(params.patientId);

  if (!patientData) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Card className="max-w-lg mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">Patient Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Could not retrieve data for patient ID: {params.patientId}. Please try again or contact support.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <FileText className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl">Emergency Admission Form</CardTitle>
          </div>
          <CardDescription className="text-md">
            Confirm or edit patient details and complete the admission/consent form.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmergencyAdmissionForm patientData={patientData} />
        </CardContent>
      </Card>
    </div>
  );
}
