import axios from 'axios';

const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

axios.defaults.baseURL = backendBaseUrl;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const refreshToken = async () => {
  try {
    const response = await axios.post(`${backendBaseUrl}/api/token/refresh`, {
      refresh: localStorage.getItem('refresh_token'),
    });
    localStorage.setItem('access_token', response.data.access);
    return response.data.access;
  } catch (error) {
    console.error('Error refreshing token:', error.response ? error.response.data : error.message); // Log refresh error
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
    return Promise.reject(error);
  }
};

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshToken();
        return axios(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axios;

