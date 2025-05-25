
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type PatientData } from '@/lib/schemas'; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileDown, Edit3, UserCog, AlertTriangle, Droplet, HeartPulse, Phone, Archive, UserCircle, Ticket } from 'lucide-react';
import jsPDF from 'jspdf'; 
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
// import { useEffect, useState } from 'react'; // Kept for potential future async history loading

interface PatientDetailsViewProps {
  patient: PatientData | null; 
}

// Dummy function to simulate fetching detailed forms/history (example for future use)
// async function fetchPatientHistory(patientId: string) {
//   await new Promise(resolve => setTimeout(resolve, 700));
//   return [
//     { id: 'form1', type: 'Admission Form', date: '2023-10-26', summary: 'Initial assessment for chest pain.' },
//     { id: 'report1', type: 'Lab Report', date: '2023-10-27', summary: 'Blood work results normal.' },
//   ];
// }


export function PatientDetailsView({ patient }: PatientDetailsViewProps) {
  const { toast } = useToast();
  // const [history, setHistory] = useState<any[]>([]);

  // useEffect(() => {
  //   if (patient) {
  //     // fetchPatientHistory(patient.id).then(setHistory);
  //   } else {
  //     setHistory([]);
  //   }
  // }, [patient]);

  const handleDownloadReport = (reportType: string) => {
    if (!patient) return;
    const doc = new jsPDF();
    doc.text(`${reportType} for ${patient.name}`, 20, 20);
    doc.text(`Patient ID: ${patient.id}`, 20, 30);
    doc.text(`Age: ${patient.age}, Gender: ${patient.gender}`, 20, 37);
    doc.text(`Blood Group: ${patient.bloodGroup}`, 20, 44);
    doc.text(`Allergies: ${patient.allergies || 'None reported'}`, 20, 51);
    doc.text(`Medical Conditions: ${patient.medicalConditions || 'None reported'}`, 20, 58);
    doc.text(`Emergency Contact: ${patient.emergencyContactName} (${patient.emergencyContactPhone})`, 20, 65);
    doc.text("--- This is a placeholder summary report. ---", 20, 80);
    doc.save(`${patient.name}_${reportType.replace(/\s+/g, '_')}_Summary.pdf`);
    toast({ title: "Report Downloaded", description: `${reportType} summary for ${patient.name} has been downloaded.`});
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
            <AvatarImage 
                src={patient.faceImageUrl || `https://placehold.co/64x64.png?text=${patient.name.charAt(0)}`} 
                alt={patient.name} 
                data-ai-hint="person avatar"
            />
            <AvatarFallback>
                {patient.name ? patient.name.split(' ').map(n => n[0]).join('').toUpperCase() : <UserCircle />}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{patient.name}</CardTitle>
            <CardDescription>ID: {patient.id} &bull; Age: {patient.age} &bull; Gender: {patient.gender}</CardDescription>
          </div>
          <Button variant="outline" size="icon" className="ml-auto" onClick={() => toast({ title: "Coming Soon", description: "Edit functionality will be implemented in a future update."})}>
            <Edit3 className="h-4 w-4" />
            <span className="sr-only">Edit Patient Record</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4 overflow-y-auto p-6"> {/* Added p-6 for consistent padding */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoBlock icon={Droplet} title="Blood Group" value={patient.bloodGroup} className="font-bold" />
          <InfoBlock icon={Phone} title="Emergency Contact" value={`${patient.emergencyContactName} (${patient.emergencyContactPhone})`} />
        </div>
        <InfoBlock icon={AlertTriangle} title="Allergies" value={patient.allergies || 'None reported'} isCritical={!!patient.allergies && patient.allergies !== 'None reported'} />
        <InfoBlock icon={HeartPulse} title="Medical Conditions" value={patient.medicalConditions || 'None reported'} isCritical={!!patient.medicalConditions && patient.medicalConditions !== 'None reported'} />

        <div className="pt-4 border-t space-y-3">
          <h4 className="font-semibold text-lg flex items-center"><Archive className="w-5 h-5 mr-2 text-primary"/>Actions & Reports</h4>
          
          <Button variant="outline" className="w-full justify-start" onClick={() => handleDownloadReport('Patient_Data_Summary')}>
            <FileDown className="h-4 w-4 mr-2" /> Download Patient Summary PDF
          </Button>

          <Button asChild variant="outline" className="w-full justify-start">
            <Link href={`/opd-slip/${patient.id}`}>
              <Ticket className="h-4 w-4 mr-2" /> Generate OPD Slip
            </Link>
          </Button>
          
          <p className="text-sm text-center text-muted-foreground py-2">Further history integration (e.g., admission forms) pending.</p>
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
  <div className={`p-3 rounded-md border ${isCritical ? 'bg-destructive/10 border-destructive/30 text-destructive' : 'bg-card border-border'}`}>
    <h5 className={`text-sm font-medium mb-1 flex items-center ${isCritical ? 'text-destructive' : 'text-muted-foreground'}`}>
      <Icon className={`w-4 h-4 mr-2 flex-shrink-0 ${isCritical ? 'text-destructive' : 'text-primary'}`} />
      {title}
    </h5>
    <p className={`text-base break-words ${isCritical ? 'font-semibold' : 'text-foreground'} ${className}`}>{value}</p>
  </div>
);

