import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircleIcon from '@mui/icons-material/Circle';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const statusColors = {
  busy: '#FF0000',
  onCall: '#FFA500',
  available: '#00FF00',
  break: '#0000FF',
  away: '#808080'
};

const statusDescriptions = {
  busy: 'Zajęty - W trakcie ważnej aktywności, np. rozmowy wideo',
  onCall: 'Na rozmowie audio - W trakcie rozmowy telefonicznej lub innej rozmowy audio',
  available: 'Dostępny - Gotowy do komunikacji i przyjęcia zadań',
  break: 'Przerwa - Na przerwie lub w trakcie zadania niewymagającego pełnej koncentracji',
  away: 'Nieobecny - Poza biurem, na urlopie lub niedostępny z innych powodów'
};

function App() {
  const [status, setStatus] = useState('available');

  useEffect(() => {
    // Here you would typically handle automatic status changes
    console.log('Setting up automatic status changes');
  }, []);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    // Here you would typically update the system tray icon
    console.log(`Status changed to: ${event.target.value}`);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ p: 2, height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            WFH Status Indicator
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CircleIcon sx={{ color: statusColors[status], mr: 1 }} />
            <Typography variant="body1">
              {statusDescriptions[status]}
            </Typography>
          </Box>
          <FormControl fullWidth>
            <Select
              value={status}
              onChange={handleStatusChange}
            >
              <MenuItem value="busy">Zajęty</MenuItem>
              <MenuItem value="onCall">Na rozmowie audio</MenuItem>
              <MenuItem value="available">Dostępny</MenuItem>
              <MenuItem value="break">Przerwa</MenuItem>
              <MenuItem value="away">Nieobecny</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button variant="contained" onClick={() => console.log('Update status manually')}>
          Aktualizuj status
        </Button>
      </Box>
    </ThemeProvider>
  );
}

export default App;
