import { useState, useEffect } from 'react'

import { 
  personServiceGetAll,
  personServiceCreate, 
  personServiceRemove,
  personServiceUpdate  
} from './services/persons'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [message, setMessage] = useState({msg: null, success: null})

  useEffect(() => {
    personServiceGetAll()
      .then(initialPersons => setPersons(initialPersons))
  },[])

  const notifier = (msg, success) => {
    const msgObject = {
      msg: msg,
      success: success
    }
    setMessage(msgObject)
    setTimeout(() => {

      setMessage({msg: null, success: null})
    }, 5000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber,
    }

    const isUniqueName = !persons.some(person => person.name === newName)
    const updatePerson = persons.filter(person => person.name === newName)

    if (isUniqueName) {
      personServiceCreate(personObject)
        .then(returnedPerson => {
          setPersons([...persons, returnedPerson])
          notifier(`Added ${returnedPerson.name}`, true)
        })
        .catch(error => {
          console.log(error.response.data.error)
          notifier(error.response.data.error, false)
        })
    } else if (window.confirm(`${updatePerson[0].name} is already added to phonebook, replace the old number with a new one?`)) {
      personServiceUpdate(updatePerson[0].id, personObject)
        .then(returnedPerson => {
          const updatePersons = 
            persons.map(person => person.id !== updatePerson[0].id ? person : returnedPerson)
          setPersons(updatePersons)
          notifier(`Updated ${updatePerson[0].name}'s number`, true)
        })
        .catch((error) => {
          if (error.response.status === 400) {
            notifier(error.response.data.error, false)
          } else {
            notifier(`Information of ${updatePerson[0].name} has already been removed from server`, false)
            setPersons(persons.filter(person => person.id !== updatePerson[0].id))
          }
        })
    }

    setNewName('')
    setNewNumber('')
  }

  const handleNameRemove = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personServiceRemove(id)
        .then(() => {
          const newPersons = persons.filter(person => person.id !== id)
          setPersons(newPersons)
          notifier(`Removed ${name}`, true)
        })
        .catch(() => {
          notifier(`Information of ${name} has already been removed from server`, false)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const handleNameChange = e => setNewName(e.target.value)

  const handleNumberChange = e => setNewNumber(e.target.value)

  const handleFilterChange = e => setFilterName(e.target.value)
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      />
      <h3>Numbers</h3>
      <Persons filterName={filterName} persons={persons} handleNameRemove={handleNameRemove} />
    </div>
  )
}

export default App