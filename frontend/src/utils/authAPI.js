import axios from 'axios';

const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

axios.defaults.baseURL = backendBaseUrl;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const refreshToken = async () => {
  try {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) throw new Error('No refresh token available');

    const response = await axios.post(`${backendBaseUrl}/api/token/refresh/`, {
      refresh: refresh_token,
    });

    localStorage.setItem('access_token', response.data.access);  // Store new access token
    if (response.data.refresh) {
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data.access;
  } catch (error) {
    localStorage.removeItem('access_token');  // Clear tokens if refresh fails
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';  // Redirect to login if refresh fails
    return Promise.reject(error);
  }
};

// Request interceptor to attach the access token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // Attach access token to header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration and retry logic
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle unauthorized error (401) and retry if token has expired
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;  // Retry original request with new token
        return axios(originalRequest);  // Retry request
      } catch (refreshError) {
        return Promise.reject(refreshError);  // Reject the error if refresh failed
      }
    }

    return Promise.reject(error);  // Reject any other errors
  }
);

export default axios;
