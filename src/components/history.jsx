import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const History = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || !storedUser.token) {
      setError('Please log in as admin to view tickets.');
      return;
    }

    const fetchTickets = async () => {
      try {
        const response = await axios.get(
          'https://ticket-management-system-backend-zjea.onrender.com/api/tickets',
          {
            headers: {
              Authorization: `Bearer ${storedUser.token}`,
            },
          }
        );
        setTickets(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load tickets.');
      }
    };

    fetchTickets();
  }, []);

  return (
    <>
      {/* Fixed Header */}
      <AppBar position="fixed" sx={{ backgroundColor: 'black' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center">
            <Box
              component="img"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHY7BfCRxRS0dsrbW_5g97mic8TuwVXmMigQ&s"
              alt="Logo"
              sx={{ width: 40, height: 40, mr: 2 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Ticket Management
            </Typography>
          </Box>
          <Box>
            <Button component={Link} to="/" color="inherit">Home</Button>
            <Button component={Link} to="/create" color="inherit">Prices</Button>
            <Button component={Link} to="/" color="inherit">Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          backgroundColor: '#f0f0f0',
          minHeight: '100vh',
          pt: 10,
          pb: 10,
        }}
      >
        <Container maxWidth="lg">
          

          {error && (
            <Typography variant="h6" color="error" align="center">
              {error}
            </Typography>
          )}

          {/* Table of Tickets */}
          <TableContainer component={Paper} elevation={6}>
            <Table>
              <TableHead sx={{ backgroundColor: 'gray' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Priority</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Created By</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket._id}>
                    <TableCell>{ticket.title || 'Untitled'}</TableCell>
                    <TableCell sx={{ maxWidth: 300 }}>{ticket.description || 'No description'}</TableCell>
                    <TableCell>{ticket.status}</TableCell>
                    <TableCell>{ticket.priority}</TableCell>
                    <TableCell>{ticket.createdBy?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        component={Link}
                        to={`/detail/${ticket._id}`}
                        sx={{
                          backgroundColor: 'orange',
                          color: 'white',
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: '#003cb3',
                          },
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>

      {/* Fixed Footer */}
      <Box
        component="footer"
        sx={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          bgcolor: '#f0f0f0',
          color: 'black',
          py: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Ticket Management System. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default History;
