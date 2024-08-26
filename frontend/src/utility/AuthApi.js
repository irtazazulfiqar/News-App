import axios from 'axios';

const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;
console.log(backendBaseUrl)

export const apiCallWithAuth = async (url, method = 'GET', body = null) => {
  const accessToken = localStorage.getItem('access_token');
    console.log(backendBaseUrl+url)
  const options = {
    method,
    url: `${backendBaseUrl}${url}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`, // Attach access token
    },
    data: body,
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
      }
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
    return { success: true };
  } catch (error) {
    return { success: false, errors: error.response ? error.response.data : { error: 'Failed to refresh token' } };
  }
};
