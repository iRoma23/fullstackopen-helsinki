import { useState, useEffect } from "react"

import { NonSensitiveDiaryEntry, NewDiaryEntry, Weather, Visibility } from "./types";

import { createDiaryEntry, getAllDiaryEntry } from "./services/diaryEntryService";
import axios from "axios";

function App() {
  const [diaryEntries, setDiaryEntries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [newDiaryEntry, setNewDiaryEntry] = useState<NewDiaryEntry>({
    date: '',
    weather: Weather.Sunny,
    visibility: Visibility.Good,
    comment: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    const fecthData = async () => {
      try {
        const data = await getAllDiaryEntry()
        setDiaryEntries(data)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.message) {
            setError(error.message)
          }
          setTimeout(() => {
            setError('')
          }, 5000)
        }
      }
    }
    fecthData()
  }, [])

  const diaryEntryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      const data = await createDiaryEntry(newDiaryEntry)
      setDiaryEntries(diaryEntries.concat(data))
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(error.response.data)
        }
        setTimeout(() => {
          setError('')
        }, 5000)
      }
    }

    setNewDiaryEntry({
      date: '',
      weather: Weather.Sunny,
      visibility: Visibility.Good,
      comment: ''
    })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target
    setNewDiaryEntry({ ...newDiaryEntry, [name]: value })
  }

  return (
    <div>
      <section>
        <h2>Add new entry</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={diaryEntryCreation}>
          <div>
            <label>date</label>
            <input
              type="date"
              name="date"
              value={newDiaryEntry.date}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>visibility </label>
            <label>{Visibility.Great}</label>
            <input
              type="radio"
              name="visibility"
              value={Visibility.Great}
              onChange={handleChange}
              checked={newDiaryEntry.visibility === Visibility.Great}
            />
            <label>{Visibility.Good}</label>
            <input
              type="radio"
              name="visibility"
              value={Visibility.Good}
              onChange={handleChange}
              checked={newDiaryEntry.visibility === Visibility.Good}
            />
            <label>{Visibility.Ok}</label>
            <input
              type="radio"
              name="visibility"
              value={Visibility.Ok}
              onChange={handleChange}
              checked={newDiaryEntry.visibility === Visibility.Ok}
            />
            <label>{Visibility.Poor}</label>
            <input
              type="radio"
              name="visibility"
              value={Visibility.Poor}
              onChange={handleChange}
              checked={newDiaryEntry.visibility === Visibility.Poor}
            />
          </div>
          <div>
            <label>weather </label>
            <label>{Weather.Sunny}</label>
            <input
              type="radio"
              name="weather"
              value={Weather.Sunny}
              onChange={handleChange}
              checked={newDiaryEntry.weather === Weather.Sunny}
            />
            <label>{Weather.Rainy}</label>
            <input
              type="radio"
              name="weather"
              value={Weather.Rainy}
              onChange={handleChange}
              checked={newDiaryEntry.weather === Weather.Rainy}
            />
            <label>{Weather.Cloudy}</label>
            <input
              type="radio"
              name="weather"
              value={Weather.Cloudy}
              onChange={handleChange}
              checked={newDiaryEntry.weather === Weather.Cloudy}
            />
            <label>{Weather.Stormy}</label>
            <input
              type="radio"
              name="weather"
              value={Weather.Stormy}
              onChange={handleChange}
              checked={newDiaryEntry.weather === Weather.Stormy}
            />
            <label>{Weather.Windy}</label>
            <input
              type="radio"
              name="weather"
              value={Weather.Windy}
              onChange={handleChange}
              checked={newDiaryEntry.weather === Weather.Windy}
            />
          </div>
          <div>
            <label>comment</label>
            <input
              name="comment"
              value={newDiaryEntry.comment}
              onChange={handleChange}
            />
          </div>
          <button type="submit">add</button>
        </form>
      </section>

      <section>
        <h2>Diary entry</h2>
        <div>
          {diaryEntries.map(diaryEntry =>
            <div key={diaryEntry.id}>
              <h3>{diaryEntry.date}</h3>
              <p>visibility: {diaryEntry.visibility}</p>
              <p>weather: {diaryEntry.weather}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default App
