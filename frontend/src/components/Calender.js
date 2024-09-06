import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { format, isAfter, isSameDay, parseISO } from 'date-fns';

const ArticleCalendar = ({ onDateChange }) => {
  const [articleDates, setArticleDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await axios('/api/articles/dates');
          // Ensure dates are parsed correctly as Date objects
          const dates = response.data.dates.map(date => parseISO(date));
          setArticleDates(dates);
      } catch (error) {
          alert('Error fetching article dates:', error);
      }
    };

    fetchDates();
  }, []);


  const isDateDisabled = (date) => {
    const today = new Date();
    // Disable dates in the future and those not in the articleDates
    return isAfter(date, today) || !articleDates.some(articleDate => isSameDay(articleDate, date));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ position: 'fixed', right: 0, top: 100, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6">Articles Calendar</Typography>
        <DatePicker
          value={selectedDate}
          onChange={(newDate) => {
            setSelectedDate(newDate);
            if (newDate) onDateChange(newDate); // Notify parent only if newDate is valid
          }}
          renderInput={(params) => <TextField {...params} />}
          shouldDisableDate={isDateDisabled}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default ArticleCalendar;
