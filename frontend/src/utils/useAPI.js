export const apiCall = async (url, method = 'POST', body) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, errors: data };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, errors: { general: ['An error occurred'] } };
  }
};
