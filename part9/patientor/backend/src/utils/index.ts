import { Gender, Diagnosis, HealthCheckRating } from "../types";

export const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

export const isNumber = (text: unknown): text is number => {
  return typeof text === 'number' || text instanceof Number;
};

export const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

export const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(g => g.toString()).includes(param);
};

export const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

export const parseValue = (value: unknown, key: string): string => {
  if (!value || !isString(value)) throw new Error(`Incorrect or missing ${key}`);
  return value;
};

export const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) throw new Error('Incorrect or missing date');
  return date;
};

export const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) throw new Error('Incorrect or missing gender');
  return gender;
};

export const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

export const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (rating === 0) return rating;
  if (!rating || !isNumber(rating) || !isHealthCheckRating(rating)) throw new Error('Incorrect or missing healthCheckRating');
  return rating;
};