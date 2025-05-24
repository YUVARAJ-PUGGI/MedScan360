"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Clock, Activity, MapPin, ListFilter, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  eta: string;
  location?: { lat: number; lng: number }; // Optional for now
}

interface PatientListProps {
  patients: Patient[];
  onSelectPatient?: (patientId: string) => void; // Callback for when a patient is selected
}

export function PatientList({ patients, onSelectPatient }: PatientListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(patients.length > 0 ? patients[0].id : null);


  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
    if (onSelectPatient) {
      onSelectPatient(patientId);
    }
  }

  return (
    <Card className="h-full flex flex-col shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <CardTitle>Incoming Patients</CardTitle>
          </div>
          <Badge variant="secondary">{filteredPatients.length} Active</Badge>
        </div>
        <CardDescription>List of patients en route or recently arrived.</CardDescription>
        <div className="relative mt-2">
          <ListFilter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filter by name or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-[calc(100vh-20rem)] md:h-[calc(100vh-25rem)] lg:h-[500px]"> {/* Adjust height as needed */}
          {filteredPatients.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No patients match your filter or no incoming patients.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {filteredPatients.map((patient) => (
                <li
                  key={patient.id}
                  className={cn(
                    "p-4 hover:bg-accent/50 cursor-pointer transition-colors",
                    selectedPatientId === patient.id && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => handleSelect(patient.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleSelect(patient.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://placehold.co/40x40.png?text=${patient.name.charAt(0)}`} alt={patient.name} data-ai-hint="person avatar" />
                      <AvatarFallback>{patient.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{patient.name}, {patient.age}</h4>
                      <p className={cn("text-sm", selectedPatientId === patient.id ? "text-accent-foreground/80" : "text-muted-foreground", "flex items-center")}>
                        <Activity className="h-4 w-4 mr-1" /> {patient.condition}
                      </p>
                    </div>
                    <div className={cn("text-sm text-right", selectedPatientId === patient.id ? "text-accent-foreground/90" : "text-foreground")}>
                      <div className="flex items-center justify-end">
                         <Clock className="h-4 w-4 mr-1" /> ETA: {patient.eta}
                      </div>
                      {patient.location && (
                        <p className={cn("text-xs", selectedPatientId === patient.id ? "text-accent-foreground/70" : "text-muted-foreground", "flex items-center justify-end")}>
                            <MapPin className="h-3 w-3 mr-1" /> {patient.location.lat.toFixed(2)}, {patient.location.lng.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
