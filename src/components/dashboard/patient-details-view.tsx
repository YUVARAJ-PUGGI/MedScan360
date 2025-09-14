
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type PatientData, type MedicalNote } from '@/lib/schemas'; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileDown, Edit3, UserCog, AlertTriangle, Droplet, HeartPulse, Phone, Archive, UserCircle, Ticket, Notebook, PlusCircle } from 'lucide-react';
import jsPDF from 'jspdf'; 
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useState } from 'react';
import NotesGenerator from './notes-generator';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

interface PatientDetailsViewProps {
  patient: PatientData | null; 
}

export function PatientDetailsView({ patient }: PatientDetailsViewProps) {
  const { toast } = useToast();
  const [showNotesGenerator, setShowNotesGenerator] = useState(false);

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
    
    if (patient.medicalHistory && patient.medicalHistory.length > 0) {
        let yPos = 90;
        doc.addPage();
        doc.text("Medical History", 20, 20);
        yPos = 30;
        patient.medicalHistory.forEach(note => {
            doc.text(`Date: ${new Date(note.date).toLocaleDateString()}`, 20, yPos);
            yPos += 7;
            doc.text(`Note: ${note.content.substring(0, 100)}...`, 20, yPos);
            yPos += 10;
        })
    }

    doc.save(`${patient.name}_${reportType.replace(/\s+/g, '_')}_Summary.pdf`);
    toast({ title: "Report Downloaded", description: `${reportType} summary for ${patient.name} has been downloaded.`});
  };
  
  if (!patient) {
    return (
      <Card className="h-full flex flex-col items-center justify-center shadow-md min-h-[500px]">
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
      <CardContent className="flex-grow space-y-4 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoBlock icon={Droplet} title="Blood Group" value={patient.bloodGroup} className="font-bold" />
          <InfoBlock icon={Phone} title="Emergency Contact" value={`${patient.emergencyContactName} (${patient.emergencyContactPhone})`} />
        </div>
        <InfoBlock icon={AlertTriangle} title="Allergies" value={patient.allergies || 'None reported'} isCritical={!!patient.allergies && patient.allergies !== 'None reported'} />
        <InfoBlock icon={HeartPulse} title="Medical Conditions" value={patient.medicalConditions || 'None reported'} isCritical={!!patient.medicalConditions && patient.medicalConditions !== 'None reported'} />

        <Separator className="my-4"/>

        {/* Medical History Section */}
        <div className="space-y-3">
            <h4 className="font-semibold text-lg flex items-center"><Notebook className="w-5 h-5 mr-2 text-primary"/>Medical History</h4>
            <Card className="bg-muted/30">
                <ScrollArea className="h-48">
                    <CardContent className="p-4">
                        {(!patient.medicalHistory || patient.medicalHistory.length === 0) ? (
                             <p className="text-sm text-muted-foreground text-center py-4">No past clinical notes found for this patient.</p>
                        ): (
                            <ul className="space-y-4">
                                {patient.medicalHistory.map(note => (
                                    <li key={note.date}>
                                        <p className="text-xs font-semibold text-primary">{new Date(note.date).toLocaleString()}</p>
                                        <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </ScrollArea>
            </Card>
        </div>

        {/* Notes Generator Section */}
        <div className="pt-4 space-y-3">
           <Button variant="secondary" className="w-full justify-start" onClick={() => setShowNotesGenerator(!showNotesGenerator)}>
            <PlusCircle className="h-4 w-4 mr-2" /> {showNotesGenerator ? "Close Note Generator" : "Add New Clinical Note"}
          </Button>
          {showNotesGenerator && <NotesGenerator patientId={patient.id} onNoteSaved={() => setShowNotesGenerator(false)}/>}
        </div>
        
        <Separator className="my-4"/>

        {/* Actions & Reports Section */}
        <div className="space-y-3">
          <h4 className="font-semibold text-lg flex items-center"><Archive className="w-5 h-5 mr-2 text-primary"/>Actions & Reports</h4>
          <Button variant="outline" className="w-full justify-start" onClick={() => handleDownloadReport('Patient_Data_Summary')}>
            <FileDown className="h-4 w-4 mr-2" /> Download Patient Summary PDF
          </Button>
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href={`/opd-slip/${patient.id}`}>
              <Ticket className="h-4 w-4 mr-2" /> Generate OPD Slip
            </Link>
          </Button>
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

    