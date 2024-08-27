import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import {apiCall} from 'utility/UseApi';
// Define the config object with field properties
const fieldConfig = {
  username: {
    label: 'Username',
    name: 'username',
    type: 'text',
    required: true,
  },
  email: {
    label: 'Email',
    name: 'email',
    type: 'email',
    required: true,
  },
  password: {
    label: 'Password',
    name: 'password',
    type: 'password',
    required: true,
  },
  confirm_password: {
    label: 'Confirm Password',
    name: 'confirm_password',
    type: 'password',
    required: true,
  },
};

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirm_password) {
      setErrors({ confirm_password: ['Passwords do not match'] });
      return;
    }

    const { success, data, errors } = await apiCall('http://127.0.0.1:8000/api/register/', 'POST', formData);

    if (success) {
      setMessage('User created successfully');
      setErrors({});
    } else {
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
              value={formData[field.name]}
              onChange={handleChange}
              error={!!errors[field.name]}
              helperText={errors[field.name]}
              margin="normal"
              required
            />
          ))}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          {message && <Typography color="success.main">{message}</Typography>}
        </Box>
      </Box>
    </Container>
  );
}

export default SignUp;