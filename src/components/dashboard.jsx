import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  Divider,
} from '@mui/material';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserTickets = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          alert('You must be logged in to view tickets.');
          return;
        }

        const token = JSON.parse(storedUser).token;

        const res = await axios.get(
          'https://ticket-management-system-backend-zjea.onrender.com/api/tickets/my-tickets',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAllTickets(res.data);
      } catch (error) {
        console.error('Error fetching user tickets:', error);
        alert('Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchUserTickets();
  }, []);

  const handleDelete = async (ticketId) => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = JSON.parse(storedUser).token;

      await axios.delete(
        `https://ticket-management-system-backend-zjea.onrender.com/api/tickets/${ticketId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove the deleted ticket from state
      setAllTickets(allTickets.filter((t) => t._id !== ticketId));
    } catch (error) {
      console.error('Error deleting ticket:', error);
      alert('Failed to delete ticket');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          My Tickets
        </Typography>

        <Paper sx={{ p: 3 }}>
          {allTickets.length === 0 ? (
            <Typography>No tickets created yet.</Typography>
          ) : (
            <List>
              {allTickets.map((t) => (
                <Box key={t._id} mb={2}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{t.title}</Typography>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        {t.description}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Priority:</strong> {t.priority} |{' '}
                        <strong>Status:</strong> {t.status}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        component={Link}
                        to={`/edit/${t._id}`}
                        variant="contained"
                        color="primary"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(t._id)}
                        variant="outlined"
                        color="error"
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              ))}
            </List>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;
