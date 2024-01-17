import { NewPatient } from '../types';

import { parseValue, parseDate, parseGender } from '.';

const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') throw new Error('Incorrect or missing data');

  if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object) {
    const newEntry: NewPatient = {
      name: parseValue(object.name, 'name'),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseValue(object.ssn, 'ssn'),
      gender: parseGender(object.gender),
      occupation: parseValue(object.occupation, 'occupation'),
      entries: []
    };

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};

export default toNewPatient;