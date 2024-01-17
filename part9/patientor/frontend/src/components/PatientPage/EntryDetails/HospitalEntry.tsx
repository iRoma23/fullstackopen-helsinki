import { HospitalEntry as Entry } from "../../../types";
import { Box, Typography } from "@mui/material";

interface Props {
  entry: Entry
}

const HospitalEntry = ({ entry }: Props) => {
  return (
    <Box>
      <Typography variant="body2">
        Discharge:
      </Typography>
      <Typography marginLeft={"1rem"} variant="body2">
        {entry.discharge.date}: {entry.discharge.criteria}
      </Typography>
    </Box>
  );
};

export default HospitalEntry;