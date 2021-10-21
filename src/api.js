import axios from 'axios';

const baseURL = `http://localhost:8080/api/chinaData?`

export function getChinaData(config) {
  let updatedURL = baseURL; 

  if (config.type) {
    updatedURL += `type=${config.type}&`;
  }
  if (config.category) {
    updatedURL += `category=${config.category}`;
  }
  if (config.year) {
    updatedURL += `year=${config.year}`
  }

  return axios.get(updatedURL)
  .then(res => console.log(res))
  .catch(error => console.log('error', error));
}
