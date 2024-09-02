import axios from 'axios';

const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

export const apiCallWithAuth = async (url, method = 'GET', body = null, cancelToken = null) => {
  const accessToken = localStorage.getItem('access_token');
  const options = {
    method,
    url: `${backendBaseUrl}${url}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`, // Attach access token
    },
    data: body,
    cancelToken,
  };

  try {
    const response = await axios(options);
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Handle token expiration
      const refreshToken = localStorage.getItem('refresh_token');
      const refreshed = await refreshAccessToken(refreshToken);
      if (refreshed.success) {
        // Retry the request with a new access token
        return apiCallWithAuth(url, method, body);
      } else {
        // Redirect to login if refresh failed
        window.location.href = '/login';
      }
    } else if (axios.isCancel(error)) {
      // Handle request cancellation
      return { success: false, errors: { error: 'Request canceled' } };
    }
    return { success: false, errors: error.response ? error.response.data : { error: 'Something went wrong' } };
  }
};
export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${backendBaseUrl}/api/token/refresh/`, {
      refresh: refreshToken
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    localStorage.setItem('access_token', response.data.access); // Store new access token
    localStorage.setItem('refresh_token', response.data.refresh); // Optionally update refresh token
    return { success: true };
  } catch (error) {
    // Optionally clear tokens and redirect to login
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return { success: false, errors: error.response ? error.response.data : { error: 'Failed to refresh token' } };
  }
};
