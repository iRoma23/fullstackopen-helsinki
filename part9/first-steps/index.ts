import express from 'express';

import { calculateBmi } from './bmiCalculator';
import { calculateExercises, ExercisesValues } from './exerciseCalculator';
import { isNotNumber } from './utils';

const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  if (isNotNumber(height) || isNotNumber(weight) || !height || !weight) {
    res.status(400).send({ error: "malformatted parameters" });
  } else {
    const bmi = calculateBmi(Number(height), Number(weight));
    res.send({
      weight,
      height,
      bmi
    });
  }
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises: dailyExercises, target } = req.body;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!dailyExercises || !target || (dailyExercises.length < 1)) {
    return res.status(400).send({ error: "parameters missings" });
  }

  if (isNotNumber(target)) {
    return res.status(400).send({ error: "malformatted parameters" });
  }

  if (dailyExercises instanceof Array) {
    if (dailyExercises.map(hours => isNotNumber(hours)).includes(true)) {
      return res.status(400).send({ error: "malformatted parameters" });
    }
  } else {
    return res.status(400).send({ error: "malformatted parameters" });
  }

  const parsedTarget = target as ExercisesValues["parsedTarget"];
  const parsedDailyExercises = dailyExercises as ExercisesValues["parsedDailyHours"];

  return res.send(calculateExercises(parsedTarget, parsedDailyExercises));
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});