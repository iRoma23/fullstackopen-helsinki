import { OccupationalHealthcareEntry as Entry } from "../../../types";

import { Box, Typography } from "@mui/material";

interface Props {
  entry: Entry
}

const OccupationalHealthcareEntry = ({ entry }: Props) => {
  return (
    <>
      {entry.sickLeave && (
        <Box>
          <Typography variant="body2">
            Sick Leave:
          </Typography>
          <Typography marginLeft={"1rem"} variant="body2">
            Start date: {entry.sickLeave?.startDate}
          </Typography>
          <Typography marginLeft={"1rem"} variant="body2">
            End date: {entry.sickLeave?.endDate}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default OccupationalHealthcareEntry;