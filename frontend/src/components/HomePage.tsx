// src/components/HomePage.tsx
import React from 'react';
import { Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <Container style={{ marginTop: '2rem', textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        Willkommen bei CONG (CONfig Generator)
      </Typography>
      <Typography variant="h5" gutterBottom>
        Dein Konfigurationsgenerator für Netzwerkgeräte
      </Typography>
      <Typography variant="body1" paragraph>
        Mit CONG kannst du einfach und schnell Konfigurationen für deine Netzwerkgeräte erstellen, verwalten und anwenden.
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/templates">
        Zu den Templates
      </Button>
    </Container>
  );
};

export default HomePage;
