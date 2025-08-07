import axios from "axios";

// Create an Axios instance
const http = axios.create({
  baseURL: import.meta.env.VITE_APP_APP_API_URL,
  withCredentials: true, // Required to send cookies
  headers: { Accept: "application/json" },
});

let isRefreshing = false;

// Queue to hold failed requests during token refresh
type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: any) => void;
};
let failedQueue: FailedRequest[] = [];

// Get the access token from local storage
const getToken = (): string | null => localStorage.getItem("token");

// Process the failed queue after token refresh
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  failedQueue = [];
};

// Set or remove the Authorization token globally
export const setAuthToken = (token?: string) => {
  if (token) {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("token", token); // Save the token
  } else {
    delete http.defaults.headers.common.Authorization;
    localStorage.removeItem("token"); // Remove the token
  }
};

// Request interceptor to add the access token
http.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

function extractPath(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.pathname;
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
}

// Response interceptor to handle token expiration
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Extract the path to determine the endpoint
    // const requestPath = extractPath(originalRequest.url);

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip token refresh for the login endpoint
      if (extractPath(error.response.request.responseURL) === "/auth/login") {
        return Promise.reject(error);
      }

      // if (extractPath(error.response.request.responseURL) === "/auth/refresh") {
      //   const { setIsNotAuthenticate } = useAuthStore.getState();
      //   setIsNotAuthenticate(true);
      //   setAuthToken(); // Clear token
      //   return Promise.reject(error);
      // }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return http(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await http.post(
          `/auth/refresh`,
          {},
          { withCredentials: true },
        );
        const newAccessToken = data.access_token;

        setAuthToken(newAccessToken); // Store the new token
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return http(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // const { setIsNotAuthenticate } = useAuthStore.getState();
        // setIsNotAuthenticate(true); // Mark user as unauthenticated

        setAuthToken(); // Clear token
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default http;
