import axios from "axios";

const baseUrl = 'http://localhost:3001/persons'

const personServiceGetAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const personServiceCreate = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const personServiceRemove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

const personServiceUpdate = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

// export default { getAll, create, update }

export {personServiceGetAll, personServiceCreate, personServiceRemove, personServiceUpdate}