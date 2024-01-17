import { CoursePart } from "../types";
import Part from "./Part";

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return (
    <div>
      {courseParts.map((part, i) => (
        <div key={i}>
          <h3>{part.name} {part.exerciseCount}</h3>
          <Part part={part} />
        </div>
      ))}
    </div>

  )
}

export default Content 