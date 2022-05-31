import React from 'react'

const Persons = ({ filterName, persons, handleNameRemove }) => {
  return (
    <div>
      {filterName
        ? persons
            .filter(person => 
              person.name.toLocaleLowerCase().includes(filterName.toLocaleLowerCase()))
            .map(person => 
              <p key={person.id}>
                {person.name} {person.number} 
                <button onClick={() => handleNameRemove(person.id, person.name)}>
                  delete
                </button>
              </p>
            )
        : persons
            .map(person =>
              <p key={person.id}>
                {person.name} {person.number} 
                <button onClick={() => handleNameRemove(person.id, person.name)}>
                  delete
                </button>
              </p>
            )
      }
    </div>
  )
}

export default Persons