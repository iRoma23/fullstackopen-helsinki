import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Typography, Box, Divider, Button } from "@mui/material";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import WorkIcon from '@mui/icons-material/Work';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

import { Patient, Gender, Diagnosis, EntryWithoutId } from "../../types";

import patientService from "../../services/patients";
import axios from "axios";

import diagnosisService from "../../services/diagnoses";

import EntryDetails from "./EntryDetails";
import AddEntryModal from "../AddEntryModal";

type GenderIcon = {
  gender: Gender,
  icon: React.JSX.Element | null
};

const genderIcons: GenderIcon[] = [
  {
    gender: Gender.Male,
    icon: <MaleIcon />
  },
  {
    gender: Gender.Female,
    icon: <FemaleIcon />
  },
  {
    gender: Gender.Other,
    icon: null
  }
];

const PatientPage = () => {
  const { id } = useParams();

  const [patient, setPatient] = useState<Patient>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  useEffect(() => {
    const fetchPatient = async () => {
      if (id !== undefined) {
        const patientData = await patientService.getById(id);
        setPatient(patientData);
      }
    };

    const fetchDiagnoses = async () => {
      const diagnosesData = await diagnosisService.getAll();
      setDiagnoses(diagnosesData);
    };

    void fetchPatient();
    void fetchDiagnoses();
  }, [id]);

  const submitNewEntry = async (values: EntryWithoutId) => {
    try {
      if (patient && id !== undefined) {
        const newNentry = await patientService.createEntry(values, id);
        setPatient({
          ...patient,
          entries: patient.entries.concat(newNentry)
        });
        setModalOpen(false);
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e.response.data === 'string') {
          const message = e.response.data.replace('Something went wrong. Error ', '');
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  const findDiagnosisByCode = (code: string): Diagnosis | undefined => {
    return diagnoses.find(diagnosis => diagnosis.code === code);
  };

  return (
    <Box>
      <Box marginTop='1rem'>
        <Typography variant="h4" marginBottom='0.5rem'>
          {patient?.name}
          {genderIcons.find(icon => icon.gender === patient?.gender)?.icon}
        </Typography>
        <Typography variant="body2">
          {patient?.ssn}
        </Typography>
        <Typography variant="body2">
          {patient?.occupation}
        </Typography>
      </Box>
      <Divider hidden />

      <AddEntryModal
        modalOpen={modalOpen}
        onClose={closeModal}
        onSubmit={submitNewEntry}
        diagnoses={diagnoses}
        error={error}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
      <Divider hidden />

      <Box marginTop='1rem'>
        <Typography variant="h5">
          entries
        </Typography>
        {patient?.entries.map(entry =>
          <Box key={entry.id} marginTop="0.5rem" sx={{ border: '1px solid' }} >
            <Typography variant="body2">
              {entry.date}
              {entry.type === 'OccupationalHealthcare' && (
                <>
                  <WorkIcon />
                  {entry.employerName}
                </>
              )}
              {entry.type === 'HealthCheck' && <MedicalServicesIcon />}
              {entry.type === 'Hospital' && <LocalHospitalIcon />}
            </Typography>
            <Typography variant="body2">
              <i>{entry.description}</i>
            </Typography>
            {entry.diagnosisCodes &&
              <Box>
                <ul>
                  {entry.diagnosisCodes.map(code =>
                    <li key={code}>
                      <Typography variant="body2">
                        {code} {findDiagnosisByCode(code)?.name}
                      </Typography>
                    </li>
                  )}
                </ul>
              </Box>
            }
            <EntryDetails entry={entry} />
            <Typography variant="body2" marginTop="0.5rem" fontWeight="600">
              diagnose by {entry.specialist}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PatientPage;