import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? import.meta.env.VITE_API_URL   
    : "",                            
  withCredentials: true
});
console.log("PROD:", import.meta.env.PROD);
console.log("API URL:", import.meta.env.VITE_API_URL);

export default api;