import axios from "axios";

// Create an Axios instance
const http = axios.create({
  baseURL: import.meta.env.VITE_APP_APP_API_URL_VOICEBOT,
  // withCredentials: true, // Required to send cookies
  headers: { Accept: "application/json" },
});

// Request interceptor to add the access token
http.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle token expiration
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  },
);

export default http;
