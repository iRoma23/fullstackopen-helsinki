import { HealthCheckRating, HealthCheckEntry as Entry } from '../../../types';

import FavoriteIcon from '@mui/icons-material/Favorite';
import { Box } from '@mui/material';
import { green, orange, red, yellow } from '@mui/material/colors';

interface Props {
  entry: Entry
}

const healthCheckRating = (rating: HealthCheckRating) => {
  switch (rating) {
    case HealthCheckRating.Healthy:
      return <FavoriteIcon sx={{ color: green[500] }} />;
    case HealthCheckRating.LowRisk:
      return <FavoriteIcon sx={{ color: yellow[500] }} />;
    case HealthCheckRating.HighRisk:
      return <FavoriteIcon sx={{ color: orange[500] }} />;
    case HealthCheckRating.CriticalRisk:
      return <FavoriteIcon sx={{ color: red[500] }} />;
  }
};

const HealthCheckEntry = ({ entry }: Props) => {
  return (
    <Box>
      {healthCheckRating(entry.healthCheckRating)}
    </Box>
  );
};

export default HealthCheckEntry;