import { isNotNumber } from "./utils";

interface Result {
  periodLength: number
  trainingDays: number
  success: boolean
  rating: number
  ratingDescription: string
  target: number
  average: number
}

export interface ExercisesValues {
  parsedTarget: number
  parsedDailyHours: number[]
}

const parseArguments = (args: string[]): ExercisesValues => {
  if (args.length < 3) throw Error('Not enough arguments, add target daily and daily exercises hours');
  if (args.length < 4) throw Error('Not enough arguments, add daily exercises hours');

  const dailyHours = args.splice(3);

  if (!dailyHours.map(hours => isNotNumber(hours)).includes(true)) {
    return {
      parsedTarget: Number(args[2]),
      parsedDailyHours: dailyHours.map(hours => Number(hours))
    };
  }
  else {
    throw Error('Provided values were not numbers!');
  }
};

export const calculateExercises = (targetDaily: number, dailyExerciseHours: number[]): Result => {
  const periodLength = dailyExerciseHours.length;

  const trainingDays = dailyExerciseHours.filter(hour => hour > 0).length;

  const average = dailyExerciseHours.reduce((acc, curr) => acc + curr, 0) / periodLength;

  const success = average >= targetDaily;

  const getRating = (average: number, targetDaily: number): number => {
    if (average < targetDaily * 0.75) return 1;
    if (average < targetDaily * 1.25) return 2;
    return 3;
  };

  const rating = getRating(average, targetDaily);

  const getRatingDescription = (rating: number): string => {
    if (rating === 1) return "bad don't give up";
    if (rating === 2) return 'not too bad but could be better';
    return 'nice work!';
  };

  const ratingDescription = getRatingDescription(rating);

  return {
    periodLength,
    trainingDays,
    target: targetDaily,
    average,
    success,
    rating,
    ratingDescription
  };
};

try {
  const { parsedTarget, parsedDailyHours } = parseArguments(process.argv);
  console.log(calculateExercises(parsedTarget, parsedDailyHours));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
