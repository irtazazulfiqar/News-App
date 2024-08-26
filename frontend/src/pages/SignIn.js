import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../utility/UseApi';
import { useAuth } from '../context/AuthContext';

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

    const { success, data, errors } = await apiCall('/api/signin/', 'POST', formData);

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
