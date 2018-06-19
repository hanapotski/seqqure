import axios from "axios";

let baseUrl = process.env.REACT_APP_WEB_API_DOMAIN || "";
baseUrl += "/api/tenants";

//////////////////////////////
// POST FUNCTIONS
//////////////////////////////

export function create(tenantData) {
  const config = {
    method: "POST",
    data: tenantData,
    withCredentials: true
  };

  return axios(baseUrl, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

//////////////////////////////
// PUT FUNCTIONS
//////////////////////////////

export function update(tenantData) {
  const config = {
    method: "PUT",
    data: tenantData,
    withCredentials: true
  };

  return axios(`${baseUrl}/${tenantData._id}`, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
}

//////////////////////////////
// GET FUNCTIONS
//////////////////////////////

export const readAll = () => {
  const config = {
    method: "GET",
    withCredentials: true
  };

  return axios(baseUrl, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
};

export const getTenantById = id => {
  const config = {
    method: "GET",
    data: id,
    withCredentials: true
  };

  return axios(`${baseUrl}/${id}`, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
};

//////////////////////////////
// DELETE FUNCTIONS
//////////////////////////////

export const del = id => {
  const config = {
    method: "DELETE",
    withCredentials: true
  };

  return axios(`${baseUrl}/${id}`, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
};

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
