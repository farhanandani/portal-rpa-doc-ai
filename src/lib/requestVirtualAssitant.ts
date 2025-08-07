/* eslint-disable prefer-const */

import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_APP_APP_API_URL_VIRTUAL_ASSISTANT,
});

let isRefreshing = false;
let failedQueue: any = [];

const getToken = () => {
  const token = localStorage.getItem("token");
  return token;
};

// Helper to process queued requests
const processQueue = (error: any, token = null) => {
  failedQueue.forEach((promise: any) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

let token = getToken();

http.defaults.headers.common.Accept = "application/json";

// Intercept requests to include the access token
http.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return http(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await http.post(
          "/auth/refresh",
          {},
          {
            withCredentials: true, // Ensure cookies are sent with the request
          },
        );

        const newAccessToken = response.data.accessToken;

        setAuthToken(newAccessToken);
        // setLogin({ token: newAccessToken });
        // Save the new access token
        // localStorage.setItem('accessToken', newAccessToken);

        // Retry the original request
        processQueue(null, newAccessToken);
        return http(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export const setAuthToken = (token?: string) => {
  if (token) {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete http.defaults.headers.common.Authorization;
    localStorage.removeItem("token");
  }
};
export default http;
