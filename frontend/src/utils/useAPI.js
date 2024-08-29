import axios from 'axios';

// Load the backend base URL from environment variables
const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL;

export const apiCall = async (url, method = 'POST', body) => {
  try {
    const response = await axios({
      url: `${backendBaseUrl}${url}`, // Combine base URL with endpoint URL
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
    });

    return { success: true, data: response.data };
  } catch (error) {
    const errors = error.response ? error.response.data : { general: ['An error occurred'] };
    return { success: false, errors };
  }
};
