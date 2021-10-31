import axios from 'axios';

const baseURL = `http://localhost:8080/api/chinaData?`

axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

export function updateURL(config) {
  let updatedURL = baseURL; 
  
  if (config.type) {
    updatedURL += `type=${config.type}&`;
  }
  if (config.category) {
    updatedURL += `category=${config.category}&`;
  }
  if (config.year) {
    updatedURL += `year=${config.year}`
  }

  return updatedURL

}

export function getReqOpt() {
  
  const myHeaders = new Headers();
  myHeaders.append("Host", "localhost:8080");
  myHeaders.append("Referer", "http://localhost:3000");
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Accept', 'application/json');
  myHeaders.append('Origin','http://localhost:3000');

  const requestOptions = {
    method: 'GET',
    mode: 'cors',
    headers: myHeaders,
    // redirect: 'follow'
  };

  // fetch(updatedURL, requestOptions)
  //   // .then(response => return response )
  //   .then(result => console.log(result))
  //   .catch(error => console.log('error', error));

  return requestOptions

  // return axios.get(updatedURL)
  // .then(res => console.log(res))
  // .catch();

}
