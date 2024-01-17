import { Alert, Dialog, DialogContent, DialogTitle, Divider } from "@mui/material";

import AddEntryForm from "./AddEntryForm";
import { Diagnosis, EntryWithoutId } from "../../types";
import { useState } from "react";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EntryWithoutId) => void;
  error?: string,
  diagnoses: Diagnosis[]
}

const AddEntryModal = ({ modalOpen, onClose, onSubmit, error, diagnoses }: Props) => {
  const [typeError, setTypeError] = useState<string>();

  const onTypeError = (error: string) => {
    setTypeError(error);
    setTimeout(() => {
      setTypeError(undefined);
    }, 3000);
  };

  return (
    <Dialog fullWidth open={modalOpen} onClose={() => onClose()}>
      <DialogTitle>Add a new entry</DialogTitle>
      <Divider />
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        {typeError && <Alert severity="error">{typeError}</Alert>}
        <AddEntryForm onCancel={onClose} onSubmit={onSubmit} diagnoses={diagnoses} onTypeError={onTypeError} />
      </DialogContent>
    </Dialog>
  );
};

export default AddEntryModal;