// src/components/TrashList.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Container,
} from '@mui/material';

interface Template {
  id: string;
  name: string;
  vendor: string;
  tags: string[];
  content: string;
}

const TrashList: React.FC = () => {
  const [trashedTemplates, setTrashedTemplates] = useState<Template[]>([]);

  useEffect(() => {
    fetchTrashedTemplates();
  }, []);

  const fetchTrashedTemplates = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/templates/trash/all');
      setTrashedTemplates(response.data);
    } catch (error) {
      console.error('Fehler beim Laden der gelöschten Templates:', error);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await axios.post(`http://localhost:5001/api/templates/trash/restore/${id}`);
      fetchTrashedTemplates();
    } catch (error) {
      console.error('Fehler beim Wiederherstellen des Templates:', error);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/templates/trash/${id}`);
      fetchTrashedTemplates();
    } catch (error) {
      console.error('Fehler beim endgültigen Löschen des Templates:', error);
    }
  };

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Papierkorb
      </Typography>
      {trashedTemplates.length === 0 ? (
        <Typography variant="body1">Der Papierkorb ist leer.</Typography>
      ) : (
        <List>
          {trashedTemplates.map((template) => (
            <ListItem key={template.id}>
              <ListItemText
                primary={template.name}
                secondary={template.vendor}
              />
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleRestore(template.id)}
                style={{ marginRight: '1rem' }}
              >
                Wiederherstellen
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handlePermanentDelete(template.id)}
              >
                Endgültig löschen
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default TrashList;
