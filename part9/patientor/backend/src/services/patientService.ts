import { v1 as uuid } from 'uuid';

import patientsData from '../../data/patients';

import { Patient, NonSensitivePatient, NewPatient, Entry, EntryWithoutId } from '../types';

const getPatients = (): Patient[] => {
  return patientsData;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patientsData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = (patient: NewPatient): Patient => {
  const id = uuid();
  const newPatient = {
    id,
    ...patient
  };

  patientsData.push(newPatient);
  return newPatient;
};

const getPatientById = (id: string): Patient | undefined => {
  return patientsData.find(patient => patient.id === id);
};

const addEntry = (entry: EntryWithoutId, patient: Patient): Entry => {
  const id = uuid();
  const newEntry = {
    id,
    ...entry
  };

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatients,
  getNonSensitivePatients,
  addPatient,
  getPatientById,
  addEntry
};