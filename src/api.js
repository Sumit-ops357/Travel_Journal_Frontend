// This file is made for Axios helper for backend requests

import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: `${apiUrl}api`, // Change to your backend URL
  // withCredentials: true, // if you're using cookies
});
export default api;
