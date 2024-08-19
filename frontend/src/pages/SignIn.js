import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Alert } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiCall } from '../utility/useApi';

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    const { success, data, errors } = await apiCall('http://127.0.0.1:8000/api/signin/', 'POST', formData);

    if (success) {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      setMessage('Login successful');
      setErrors({});
    } else {
      setErrors(errors);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Sign In
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          margin="normal"
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          margin="normal"
          error={!!errors.password}
          helperText={errors.password}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Sign In
        </Button>
      </form>
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
    </Container>
  );
}

export default SignIn;
