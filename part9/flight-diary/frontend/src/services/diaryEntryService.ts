import axios from "axios";
import { NewDiaryEntry, NonSensitiveDiaryEntry } from "../types";

const baseUrl = 'http://localhost:3000/api/diaries'

export const getAllDiaryEntry = async () => {
  const response = await axios.get<NonSensitiveDiaryEntry[]>(baseUrl)
  return response.data
}

export const createDiaryEntry = async (obj: NewDiaryEntry) => {
  const response = await axios.post<NonSensitiveDiaryEntry>(baseUrl, obj)
  return response.data
}
