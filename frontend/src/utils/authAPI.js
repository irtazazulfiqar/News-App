const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

export const apiCallWithAuth = async (url, method = 'GET', body = null) => {
  const accessToken = localStorage.getItem('access_token');

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`, // Attach access token
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${backendBaseUrl}${url}`, options);
    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else if (response.status === 401) {
      // Handle token expiration
      const refreshToken = localStorage.getItem('refresh_token');
      const refreshed = await refreshAccessToken(refreshToken);
      if (refreshed.success) {
        // Retry the request with a new access token
        return apiCallWithAuth(url, method, body);
      }
    } else {
      return { success: false, errors: data };
    }
  } catch (error) {
    return { success: false, errors: { error: 'Something went wrong' } };
  }
};

export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await fetch(`${backendBaseUrl}/api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('access_token', data.access); // Store new access token
      return { success: true };
    } else {
      return { success: false, errors: data };
    }
  } catch (error) {
    return { success: false, errors: { error: 'Failed to refresh token' } };
  }
};
