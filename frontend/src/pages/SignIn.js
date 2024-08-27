import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiCall } from 'utility/UseApi';
import { useAuth } from 'context/AuthContext';

// Define the config object with field properties
const fieldConfig = {
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
};

function SignIn() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { success, data, errors } = await apiCall('http://127.0.0.1:8000/api/signin/', 'POST', formData);

    if (success) {
      login(data.access, data.refresh);
      setMessage('Login successful');
      setErrors({});
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } else {
      setErrors(errors);
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