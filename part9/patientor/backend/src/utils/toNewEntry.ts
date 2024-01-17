import {
  EntryWithoutId,
  NewBaseEntry,
  EntryWithoutBaseEntry,
} from "../types";

import {
  parseValue,
  parseDate,
  parseDiagnosisCodes,
  parseHealthCheckRating
} from ".";

const getNewTypeEntry = (obj: object & Record<"type", unknown>): EntryWithoutBaseEntry => {
  switch (obj.type) {

    case "HealthCheck":
      if ('healthCheckRating' in obj) {
        return {
          type: obj.type,
          healthCheckRating: parseHealthCheckRating(obj.healthCheckRating)
        };
      }
      throw new Error('Missing healthCheckRating');

    case "Hospital":
      if ('discharge' in obj) {
        if (!obj.discharge || typeof obj.discharge !== 'object') throw new Error('Incorrect or missing discharge');

        if ('date' in obj.discharge && 'criteria' in obj.discharge) {
          return {
            type: obj.type,
            discharge: {
              criteria: parseValue(obj.discharge.criteria, 'criteria'),
              date: parseDate(obj.discharge.date)
            }
          };
        }
        throw new Error('Missing criteria or date');
      }
      throw new Error('Missing discharge');

    case 'OccupationalHealthcare':
      if ('employerName' in obj) {
        if ('sickLeave' in obj) {
          if (!obj.sickLeave || typeof obj.sickLeave !== 'object') throw new Error('Incorrect or missing sickLeave');

          if ('startDate' in obj.sickLeave && 'endDate' in obj.sickLeave) {
            return {
              type: obj.type,
              employerName: parseValue(obj.employerName, 'employerName'),
              sickLeave: {
                endDate: parseDate(obj.sickLeave.endDate),
                startDate: parseDate(obj.sickLeave.startDate)
              }
            };
          }
          throw new Error('Missing startDate or endDate');
        }
        return {
          type: obj.type,
          employerName: parseValue(obj.employerName, 'employerName'),
        };
      }
      throw new Error('Missing employerName');
    default:
      throw new Error('Incorrect or missing type');
  }
};

const toNewEntry = (object: unknown): EntryWithoutId => {
  if (!object || typeof object !== 'object') throw new Error('Incorrect or missing data');

  if ('description' in object && 'date' in object && 'specialist' in object && 'type' in object) {
    let newBaseEntry: NewBaseEntry = {
      description: parseValue(object.description, 'description'),
      date: parseDate(object.date),
      specialist: parseValue(object.specialist, 'specialist')
    };

    if ('diagnosisCodes' in object) {
      newBaseEntry = {
        ...newBaseEntry,
        diagnosisCodes: parseDiagnosisCodes(object)
      };
    }

    const newEntry: EntryWithoutId = {
      ...newBaseEntry,
      ...getNewTypeEntry(object)
    };

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};

export default toNewEntry;