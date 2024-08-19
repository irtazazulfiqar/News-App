import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';

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
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirm_password) {
      setErrors({ confirm_password: ["Passwords do not match"] });
      return;
    }

    const response = await fetch('http://127.0.0.1:8000/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok) {
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
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username && errors.username}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email && errors.email}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password && errors.password}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirm_password"
            type="password"
            value={formData.confirm_password}
            onChange={handleChange}
            error={!!errors.confirm_password}
            helperText={errors.confirm_password && errors.confirm_password}
            margin="normal"
            required
          />
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
