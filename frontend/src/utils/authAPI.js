//import axios from 'axios';
//
//const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;
//
//export const apiCallWithAuth = async (url, method = 'GET', body = null) => {
//  const accessToken = localStorage.getItem('access_token');
//  const options = {
//    method,
//    url: `${backendBaseUrl}${url}`,
//    headers: {
//      'Content-Type': 'application/json',
//      Authorization: `Bearer ${accessToken}`, // Attach access token
//    },
//    data: body,
//  };
//
//  try {
//    const response = await axios(options);
//    return { success: true, data: response.data };
//  } catch (error) {
//    if (error.response && error.response.status === 401) {
//      // Handle token expiration
//      const refreshToken = localStorage.getItem('refresh_token');
//      const refreshed = await refreshAccessToken(refreshToken);
//      if (refreshed.success) {
//        // Retry the request with a new access token
//        return apiCallWithAuth(url, method, body);
//      }
//    }
//    return { success: false, errors: error.response ? error.response.data : { error: 'Something went wrong' } };
//  }
//};
//
//export const refreshAccessToken = async (refreshToken) => {
//  try {
//    const response = await axios.post(`${backendBaseUrl}/api/token/refresh/`, {
//      refresh: refreshToken
//    }, {
//      headers: {
//        'Content-Type': 'application/json',
//      }
//    });
//
//    localStorage.setItem('access_token', response.data.access); // Store new access token
//    return { success: true };
//  } catch (error) {
//    return { success: false, errors: error.response ? error.response.data : { error: 'Failed to refresh token' } };
//  }
//};
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

