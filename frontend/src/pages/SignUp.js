import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { apiCall } from 'utils/useAPI';

const fieldConfig = {
  username: {
    label: 'Username',
    name: 'username',
    type: 'text',
    required: true,
    validate: (value) => value.length > 2 || 'Username must be at least 3 characters long',
  },
  email: {
    label: 'Email',
    name: 'email',
    type: 'email',
    required: true,
    validate: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Enter a valid email address',
  },
  password: {
    label: 'Password',
    name: 'password',
    type: 'password',
    required: true,
    validate: (value) => value.length >= 8 || 'Password must be at least 8 characters long',
  },
  confirm_password: {
    label: 'Confirm Password',
    name: 'confirm_password',
    type: 'password',
    required: true,
    validate: (value, formData) =>
      value === formData.password || 'Passwords do not match',
  },
};

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    validateField(name, value);
  };

  const validateField = (name, value) => {
    const field = fieldConfig[name];
    let error = '';

    if (field.required && !value) {
      error = `${field.label} is required`;
    } else if (field.validate) {
      const validationResult = field.validate(value, formData);
      if (typeof validationResult === 'string') {
        error = validationResult;
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error ? [error] : [],
    }));
  };

  useEffect(() => {
    const formIsValid = Object.keys(fieldConfig).every(
      (key) => formData[key] !== '' && !errors[key]?.length
    );

    setIsSubmitDisabled(!formIsValid);
  }, [formData, errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { success, data, errors: apiErrors } = await apiCall('/api/register/', 'POST', formData);

    if (success) {
      setFormData({
        username: '',
        email: '',
        password: '',
        confirm_password: '',
      });
      setErrors({});
      setMessage('Successfully signed up');
    } else {
      console.log('API Errors:', apiErrors);

      // Normalize the errors into an object with arrays for each field
      const normalizedErrors = Object.keys(apiErrors).reduce((acc, key) => {
        acc[key] = Array.isArray(apiErrors[key]) ? apiErrors[key] : [apiErrors[key]];
        return acc;
      }, {});

      setErrors(normalizedErrors);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {Object.values(fieldConfig).map((field) => (
            <TextField
              key={field.name}
              fullWidth
              label={field.label}
              name={field.name}
              type={field.type}
              value={formData[field.name] || ''} // Ensure default value is empty string
              onChange={handleChange}
              onBlur={(e) => validateField(field.name, e.target.value)} // Validate on blur as well
              error={!!errors[field.name] && errors[field.name].length > 0} // Show error if it exists
              helperText={errors[field.name]?.join(', ') || ''} // Display error messages, joined by commas
              margin="normal"
              required={field.required}
            />
          ))}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitDisabled} // Disable submit if form is invalid
          >
            Sign Up
          </Button>
          {message && <Typography color="success.main">{message}</Typography>}
          {/* Display general errors if any */}
          {Object.keys(errors).length > 0 && !Object.values(errors).some(errs => errs.length > 0) && (
            <Typography color="error.main">
              {Object.values(errors).flat().join(', ')}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default SignUp;
