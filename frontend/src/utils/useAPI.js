export const apiCall = async (url, method = 'POST', body) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}${url}`, {
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
