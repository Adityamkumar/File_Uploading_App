import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD ? import.meta.env.VITE_API_URL : "",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // If refresh itself fails → logout
    if (originalRequest.url.includes("/refresh-token")) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      // Wait for ongoing refresh
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => {
        return api(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      await axios.post(
        "/api/auth/refresh-token",
        {},
        { withCredentials: true }
      );

      processQueue(null);
      return api(originalRequest);

    } catch (err) {
      processQueue(err);
      window.location.href = "/login";
      return Promise.reject(err);

    } finally {
      isRefreshing = false;
    }
  }
);
export default api;
