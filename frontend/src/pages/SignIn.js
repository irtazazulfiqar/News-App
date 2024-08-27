import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiCall } from 'utils/useAPI';

// Define the config object with field properties and validation logic
const fieldConfig = {
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
    validate: (value) => value.length >= 6 || 'Password must be at least 6 characters long',
  },
};

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate the field on change
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const field = fieldConfig[name];
    let error = '';

    if (field.required && !value) {
      error = `${field.label} is required`;
    } else if (field.validate) {
      const validationResult = field.validate(value);
      if (typeof validationResult === 'string') {
        error = validationResult;
      }
    }

    // Update the error state
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  // Validate the form and enable/disable the submit button
  useEffect(() => {
    const formIsValid = Object.keys(fieldConfig).every(
      (key) => formData[key] !== '' && !errors[key]
    );

    setIsSubmitDisabled(!formIsValid);
  }, [formData, errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { success, data, errors: serverErrors } = await apiCall('/api/signin/', 'POST', formData);

    if (success) {
      setMessage('Login successful');
      setErrors({});
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } else {
      setErrors(serverErrors || {});
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          {Object.values(fieldConfig).map((field) => (
            <TextField
              key={field.name}
              fullWidth
              label={field.label}
              name={field.name}
              type={field.type}
              value={formData[field.name]}
              onChange={handleChange}
              onBlur={(e) => validateField(field.name, e.target.value)}
              error={!!errors[field.name]}
              helperText={errors[field.name]}
              margin="normal"
              required={field.required}
            />
          ))}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitDisabled}
          >
            Sign In
          </Button>
          {message && (
            <Alert severity="success" style={{ marginTop: '20px' }}>
              {message}
            </Alert>
          )}
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" style={{ marginTop: '20px' }}>
              Please check the fields and try again.
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default SignIn;
