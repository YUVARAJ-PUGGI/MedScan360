
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback } from 'react';
import type { PatientData } from '@/lib/schemas';

interface PatientContextType {
  patients: PatientData[];
  addPatient: (patient: PatientData) => void;
  getPatientById: (id: string) => PatientData | undefined;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientDataProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<PatientData[]>([]);

  const addPatient = useCallback((patient: PatientData) => {
    setPatients((prevPatients) => [...prevPatients, patient]);
  }, []);

  const getPatientById = useCallback((id: string) => {
    return patients.find(p => p.id === id);
  }, [patients]);

  return (
    <PatientContext.Provider value={{ patients, addPatient, getPatientById }}>
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
