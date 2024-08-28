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
    validate: (value) => value.length >= 6 || 'Password must be at least 6 characters long',
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
    confirm_password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  // Handle field change and validate real-time
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate immediately after change
    validateField(name, value);
  };

  // Validate individual fields
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

    // Set the error state
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  // Validate the entire form and enable/disable the submit button
  useEffect(() => {
    // Check if all fields are valid
    const formIsValid = Object.keys(fieldConfig).every(
      (key) => formData[key] !== '' && !errors[key]
    );

    setIsSubmitDisabled(!formIsValid);
  }, [formData, errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Submit form data via an API call
    const { success, data } = await apiCall('/api/register/', 'POST', formData);

    if (success) {
      setFormData({
        username: '',
        email: '',
        password: '',
        confirm_password: ''
      });
      setErrors({});
      setIsSubmitDisabled(true);
    } else {
      // Handle server-side validation errors if any
      setErrors(data);
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
              value={formData[field.name]} // Use controlled input
              onChange={handleChange}
              onBlur={(e) => validateField(field.name, e.target.value)} // Validate on blur as well
              error={!!errors[field.name]} // Show error if it exists
              helperText={errors[field.name]} // Display error message
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
        </Box>
      </Box>
    </Container>
  );
}

export default SignUp;
