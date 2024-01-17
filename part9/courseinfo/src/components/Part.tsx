import { CoursePart } from "../types"

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case "basic":
      return (
        <p><i>{part.description}</i></p>
      );
    case "group":
      return (
        <>
          <p>{part.groupProjectCount}</p>
        </>
      );
    case "background":
      return (
        <>
          <p><i>{part.description}</i></p>
          <p>{part.backgroundMaterial}</p>
        </>
      );
    case "special":
      return (
        <>
          <p><i>{part.description}</i></p>
          <p><span>Required skills: </span>{part.requirements.join(', ')}</p>
        </>
      )
    default:
      return assertNever(part);
  }
}

export default Part