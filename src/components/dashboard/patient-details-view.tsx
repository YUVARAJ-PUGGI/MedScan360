"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type PatientData } from '@/lib/schemas'; // Assuming full patient data structure might be available
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileDown, Edit3, UserCog, AlertTriangle, Droplet, HeartPulse, Phone, FileText, Archive } from 'lucide-react';
import jsPDF from 'jspdf'; // For dummy report download
import { useToast } from '@/hooks/use-toast';

interface PatientDetailsViewProps {
  patient: PatientData | null; // Use the more detailed PatientData if available
}

// Dummy function to simulate fetching detailed forms/history
async function fetchPatientHistory(patientId: string) {
  await new Promise(resolve => setTimeout(resolve, 700));
  return [
    { id: 'form1', type: 'Admission Form', date: '2023-10-26', summary: 'Initial assessment for chest pain.' },
    { id: 'report1', type: 'Lab Report', date: '2023-10-27', summary: 'Blood work results normal.' },
  ];
}


export function PatientDetailsView({ patient }: PatientDetailsViewProps) {
  const { toast } = useToast();
  // const [history, setHistory] = useState<any[]>([]); // For fetched history

  // useEffect(() => {
  //   if (patient) {
  //     fetchPatientHistory(patient.id).then(setHistory);
  //   } else {
  //     setHistory([]);
  //   }
  // }, [patient]);

  const handleDownloadReport = (reportType: string) => {
    if (!patient) return;
    const doc = new jsPDF();
    doc.text(`${reportType} for ${patient.name}`, 20, 20);
    doc.text(`Patient ID: ${patient.id}`, 20, 30);
    doc.text("This is a placeholder report.", 20, 40);
    doc.save(`${patient.name}_${reportType.replace(' ', '_')}.pdf`);
    toast({ title: "Report Downloaded", description: `${reportType} for ${patient.name} has been downloaded.`});
  };
  
  if (!patient) {
    return (
      <Card className="h-full flex flex-col items-center justify-center shadow-md">
        <CardHeader className="text-center">
           <UserCog className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle>No Patient Selected</CardTitle>
          <CardDescription>Select a patient from the list to view details.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col shadow-md">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={patient.faceImageUrl || `https://placehold.co/64x64.png?text=${patient.name.charAt(0)}`} alt={patient.name} data-ai-hint="person avatar"/>
            <AvatarFallback>{patient.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{patient.name}</CardTitle>
            <CardDescription>ID: {patient.id} &bull; Age: {patient.age} &bull; Gender: {patient.gender}</CardDescription>
          </div>
          <Button variant="outline" size="icon" className="ml-auto" onClick={() => alert('Edit functionality not implemented.')}>
            <Edit3 className="h-4 w-4" />
            <span className="sr-only">Edit Patient Record</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoBlock icon={Droplet} title="Blood Group" value={patient.bloodGroup} className="text-red-600 dark:text-red-400 font-bold" />
          <InfoBlock icon={Phone} title="Emergency Contact" value={`${patient.emergencyContactName} (${patient.emergencyContactPhone})`} />
        </div>
        <InfoBlock icon={AlertTriangle} title="Allergies" value={patient.allergies || 'None reported'} isCritical={!!patient.allergies} />
        <InfoBlock icon={HeartPulse} title="Medical Conditions" value={patient.medicalConditions || 'None reported'} />

        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2 flex items-center text-lg"><Archive className="w-5 h-5 mr-2 text-primary"/>Medical History & Forms</h4>
          {/* Placeholder for history/forms list */}
          <div className="space-y-2">
            <div className="p-3 border rounded-md bg-muted/50 flex justify-between items-center">
              <div>
                <p className="font-medium">Emergency Admission Form</p>
                <p className="text-xs text-muted-foreground">Date: {new Date().toLocaleDateString()}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDownloadReport('Admission_Form_Summary')}>
                <FileDown className="h-4 w-4 mr-1" /> Download
              </Button>
            </div>
             <div className="p-3 border rounded-md bg-muted/50 flex justify-between items-center">
              <div>
                <p className="font-medium">Lab Results (Example)</p>
                <p className="text-xs text-muted-foreground">Date: {new Date(Date.now() - 86400000).toLocaleDateString()}</p> {/* Yesterday */}
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDownloadReport('Lab_Results')}>
                <FileDown className="h-4 w-4 mr-1" /> Download
              </Button>
            </div>
             <p className="text-sm text-center text-muted-foreground py-2">Further history integration pending.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface InfoBlockProps {
  icon: React.ElementType;
  title: string;
  value: string;
  className?: string;
  isCritical?: boolean;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ icon: Icon, title, value, className, isCritical }) => (
  <div className={`p-3 rounded-md border ${isCritical ? 'bg-destructive/10 border-destructive/30' : 'bg-card'}`}>
    <h5 className={`text-sm font-medium mb-1 flex items-center ${isCritical ? 'text-destructive' : 'text-muted-foreground'}`}>
      <Icon className={`w-4 h-4 mr-2 ${isCritical ? 'text-destructive' : 'text-primary'}`} />
      {title}
    </h5>
    <p className={`text-base ${isCritical ? 'text-destructive font-semibold' : 'text-foreground'} ${className}`}>{value}</p>
  </div>
);
