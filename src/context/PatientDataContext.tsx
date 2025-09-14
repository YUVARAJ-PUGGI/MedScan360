
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback } from 'react';
import type { PatientData, MedicalNote } from '@/lib/schemas';

interface PatientContextType {
  patients: PatientData[];
  addPatient: (patient: PatientData) => void;
  getPatientById: (id: string) => PatientData | undefined;
  addNoteToPatientHistory: (patientId: string, noteContent: string) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientDataProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<PatientData[]>([]);

  const addPatient = useCallback((patient: PatientData) => {
    // Initialize medical history for new patients
    const patientWithHistory = { ...patient, medicalHistory: [] };
    setPatients((prevPatients) => [...prevPatients, patientWithHistory]);
  }, []);

  const getPatientById = useCallback((id: string) => {
    return patients.find(p => p.id === id);
  }, [patients]);

  const addNoteToPatientHistory = useCallback((patientId: string, noteContent: string) => {
    setPatients(prevPatients => 
        prevPatients.map(patient => {
            if (patient.id === patientId) {
                const newNote: MedicalNote = {
                    date: new Date().toISOString(),
                    content: noteContent,
                };
                const updatedHistory = patient.medicalHistory ? [...patient.medicalHistory, newNote] : [newNote];
                return { ...patient, medicalHistory: updatedHistory };
            }
            return patient;
        })
    );
  }, []);

  return (
    <PatientContext.Provider value={{ patients, addPatient, getPatientById, addNoteToPatientHistory }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatientData() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatientData must be used within a PatientDataProvider');
  }
  return context;
}
