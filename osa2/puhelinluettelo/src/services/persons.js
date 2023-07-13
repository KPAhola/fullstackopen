import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  return (
    axios
      .get(baseUrl)
      .then(response => response.data)
  )
}

const create = contact => {
  return (
    axios
      .post(baseUrl, contact)
      .then(response => response.data)
  )
}

const remove = id => {
  return (
    axios
      .delete(`${baseUrl}/${id}`)
  )
}

const update = (id, newInfo) => {
  return (
    axios
      .put(`${baseUrl}/${id}`, newInfo)
      .then(response => response.data)
  )
}

export default { getAll, create, remove, update }
