import { Grid, TextField, Button, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { SyntheticEvent, useState } from "react";

import { Diagnosis, Entry, EntryWithoutId, HealthCheckRating } from "../../types";

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryWithoutId) => void
  diagnoses: Diagnosis[];
  onTypeError: (value: string) => void
}

interface HealthCheckRatingOption {
  value: HealthCheckRating;
  label: string;
}

const healthCheckRatingOptions: HealthCheckRatingOption[] = Object.values(HealthCheckRating)
  .filter(v => typeof v === 'number')
  .map(v => ({
    value: v as number, label: HealthCheckRating[v as number]
  }));

const AddEntryForm = ({ onCancel, onSubmit, diagnoses, onTypeError }: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCode, setDiagnosisCode] = useState<Entry["diagnosisCodes"]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState(HealthCheckRating.Healthy);
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState('');
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState('');

  const [type, setType] = useState<Entry["type"] | ''>('');


  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    const baseEntry = {
      description,
      date,
      specialist,
      diagnosisCode,
    };

    if (!type) {
      onTypeError('Missing type');
    }

    else if (type === 'HealthCheck') {
      onSubmit({
        ...baseEntry,
        type,
        healthCheckRating
      });
    }

    else if (type === 'Hospital') {
      onSubmit({
        ...baseEntry,
        type,
        discharge: {
          date: dischargeDate,
          criteria: dischargeCriteria
        }
      });
    }

    else if (type === 'OccupationalHealthcare') {
      onSubmit({
        ...baseEntry,
        type,
        employerName,
        sickLeave: sickLeaveStartDate && sickLeaveEndDate
          ? { startDate: sickLeaveStartDate, endDate: sickLeaveEndDate }
          : undefined
      });
    }
  };

  const onTypeChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if (event.target.value === 'HealthCheck' || event.target.value === 'Hospital' || event.target.value === 'OccupationalHealthcare') {
      const value = event.target.value;
      setType(value);
    }
  };

  const onDiagnosisCodeChange = (event: SelectChangeEvent<string[]>) => {
    event.preventDefault();
    let value = event.target.value;

    if (typeof value === 'string') value = value.split('');
    setDiagnosisCode(value);
  };

  const onHealthCheckRatingChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    const value = Number(event.target.value);

    const raiting = Object.values(HealthCheckRating).find(r => r === value);
    if (raiting !== undefined && typeof raiting !== "string") {
      setHealthCheckRating(raiting);
    }
  };

  return (
    <div>
      <form onSubmit={addEntry}>
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <TextField
          type="date"
          // fullWidth
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={(e) => setSpecialist(e.target.value)}
        />

        <InputLabel>Diagnoses codes</InputLabel>
        <Select
          label="Diagnosis Code"
          fullWidth
          value={diagnosisCode}
          onChange={onDiagnosisCodeChange}
          multiple
        // input={<OutlinedInput />}
        >
          {diagnoses.map(diagnosis => (
            <MenuItem key={diagnosis.code} value={diagnosis.code}>{diagnosis.code}</MenuItem>
          ))}
        </Select>

        <InputLabel>Entry Type</InputLabel>
        <Select
          label="Entry Type"
          fullWidth
          value={type}
          onChange={onTypeChange}
        >
          <MenuItem value="HealthCheck">Health Check</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
          <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
        </Select>

        {type === 'HealthCheck' && (
          <>
            <InputLabel>Health Check Rating</InputLabel>
            <Select
              label="Health Check Rating"
              fullWidth
              value={healthCheckRating.toString()}
              onChange={onHealthCheckRatingChange}
            >
              {healthCheckRatingOptions.map(option =>
                <MenuItem
                  key={option.label}
                  value={option.value}
                >
                  {option.label}
                </MenuItem>
              )}
            </Select>
          </>
        )}
        {type === 'Hospital' && (
          <>
            <TextField
              label="Discharge Date"
              fullWidth
              value={dischargeDate}
              onChange={(e) => setDischargeDate(e.target.value)}
            />

            <TextField
              label="Discharge Criteria"
              fullWidth
              value={dischargeCriteria}
              onChange={(e) => setDischargeCriteria(e.target.value)}
            />
          </>
        )}
        {type === 'OccupationalHealthcare' && (
          <>
            <TextField
              label="Employer Name"
              fullWidth
              value={employerName}
              onChange={(e) => setEmployerName(e.target.value)}
            />

            <InputLabel>Sick Leave Start Date</InputLabel>
            <TextField
              type="date"
              // fullWidth
              value={sickLeaveStartDate}
              onChange={(e) => setSickLeaveStartDate(e.target.value)}
            />


            <InputLabel>Sick Leave End Date</InputLabel>
            <TextField
              type="date"
              // fullWidth
              value={sickLeaveEndDate}
              onChange={(e) => setSickLeaveEndDate(e.target.value)}
            />
          </>
        )}

        <Grid marginTop='1rem'>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              style={{ float: "right" }}
              type="submit"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div >
  );
};

export default AddEntryForm;