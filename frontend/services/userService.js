import axios from "axios";

let baseUrl = process.env.REACT_APP_WEB_API_DOMAIN || "";
baseUrl += "/api/users";

//////////////////////////////
// GET FUNCTIONS
//////////////////////////////

export const forgotPasswordReset = token => {
  const url = baseUrl + "/forgotPassword/" + token;

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
export const forgotPassword = data => {
  const url = baseUrl + "/forgotPassword";

  const config = {
    method: "PUT",
    withCredentials: true,
    data: data
  };

  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
};

export const resetPassword = ({ password, token }) => {
  const url = baseUrl + "/resetPassword/" + token;
  const config = {
    data: { password },
    method: "PUT",
    withCredentials: true
  };
  return axios(url, config)
    .then(responseSuccessHandler)
    .catch(responseErrorHandler);
};

//////////////////////////////
// CALLBACK FUNCTIONS
//////////////////////////////

const responseSuccessHandler = response => response.data;

const responseErrorHandler = error => Promise.reject(error);
