import axios from "axios";

let baseUrl = process.env.REACT_APP_WEB_API_DOMAIN || "";
baseUrl += "/api/escrowPeople/";

//////////////////////////////
// POST FUNCTIONS
//////////////////////////////

export function create(personData) {
  const config = {
    method: "POST",
    data: personData,
    withCredentials: true
  };

  return axios(baseUrl, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

//////////////////////////////
// GET FUNCTIONS
//////////////////////////////

export function readAll(escrowId) {
  const config = {
    method: "GET",
    withCredentials: true,
    data: escrowId
  };

  return axios(`${baseUrl}/${escrowId}`, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

export const search = name => {
  const url = baseUrl + "search/" + name;

  const config = {
    method: "GET",
    withCredentials: true
  };

  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
};

//////////////////////////////
// PUT FUNCTIONS
//////////////////////////////

export function update(personData) {
  const config = {
    method: "PUT",
    data: personData,
    withCredentials: true
  };

  return axios(`${baseUrl}/${personData._id}`, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

//////////////////////////////
// DELETE FUNCTIONS
//////////////////////////////

export function del(id) {
  const config = {
    method: "DELETE",
    withCredentials: true
  };

  return axios(`${baseUrl}/${id}`, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

//////////////////////////////
// CALLBACK FUNCTIONS
//////////////////////////////

const responseSuccessHandler = response => {
  return response.data;
};

const responseErrorHandler = error => {
  console.log(error);
  return Promise.reject(error);
};
