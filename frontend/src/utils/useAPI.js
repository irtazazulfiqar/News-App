export const apiCall = async (url, method = 'POST', body) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log(response);
    // Check if the response status is OK (status code 200-299)
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, errors: errorData };
    }

    // Parse the JSON response
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    // Handle network or unexpected errors
    console.error('API call error:', error);
    return { success: false, errors: { general: ['An error occurred'] } };
  }
};
