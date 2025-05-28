import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  ButtonGroup,
  Box,
  TextField,
  List,
  ListItem,
  Paper,
  Divider,
  CircularProgress,
  AppBar,
  Toolbar,
  Link,
} from '@mui/material';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://ticket-management-system-backend-zjea.onrender.com/api/tickets/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTicket(response.data);
      } catch (err) {
        setError('Failed to load ticket');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchTicket();
    else {
      setError('User not authenticated');
      setLoading(false);
    }
  }, [id, token]);

  const updateStatus = async (newStatus) => {
    try {
      await axios.patch(
        `https://ticket-management-system-backend-zjea.onrender.com/api/tickets/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTicket((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };


  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://ticket-management-system-backend-zjea.onrender.com/api/tickets/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/history');
    } catch (err) {
      console.error(err);
      alert('Failed to delete ticket');
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 5, textAlign: 'center' }}>
        <CircularProgress />
        <Typography mt={2}>Loading ticket details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 5 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!ticket) return null;

  return (
    <>
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
                  <Button component={Link} to="/dashboard/:id" color="inherit">View Tickets</Button>
                  <Button component={Link} to="/" color="inherit">Logout</Button>
                </Box>
              </Toolbar>
            </AppBar>
    <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', py: 5 }}>
      <Container maxWidth="md" sx={{marginTop:"40px"}}>
        

        <Paper elevation={4} sx={{ borderRadius: 3, p: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ color: 'gray' }}>
            Ticket Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Card elevation={0} sx={{ background: 'transparent' }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {ticket.title}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {ticket.description}
              </Typography>
              <Box mt={2}>
                <Typography color="text.secondary">
                  <strong>Priority:</strong> {ticket.priority}
                </Typography>
                <Typography color="text.secondary">
                  <strong>Status:</strong> {ticket.status}
                </Typography>
              </Box>
            </CardContent>

            <CardActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
              <ButtonGroup  sx={{ background: 'white', color:'orange' }}>
                <Button onClick={() => updateStatus('pending')}>Pending</Button>
                <Button onClick={() => updateStatus('open')}>In Progress</Button>
                <Button onClick={() => updateStatus('resolved')}>Resolved</Button>
              </ButtonGroup>
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  sx={{ background: 'orange', color: 'white' }}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </Box>
            </CardActions>
          </Card>
        </Paper>

       <Button onClick={() => navigate('/history')} sx={{ mb: 2 , background:"orange", color:"white"}}   >
          Back to History
        </Button>
      </Container>
    </Box>
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

export default TicketDetail;
