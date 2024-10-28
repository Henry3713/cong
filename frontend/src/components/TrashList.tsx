// src/components/TrashList.tsx
import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Container,
} from '@mui/material';
import { getTrash, restoreTemplate, deleteTemplateForever } from '../api'; // Importiere die zentralen API-Funktionen

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
      const data = await getTrash();
      setTrashedTemplates(data);
    } catch (error) {
      console.error('Fehler beim Laden der gelöschten Templates:', error);
      alert('Fehler beim Laden der gelöschten Templates.');
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreTemplate(id);
      alert('Template erfolgreich wiederhergestellt!');
      fetchTrashedTemplates();
    } catch (error) {
      console.error('Fehler beim Wiederherstellen des Templates:', error);
      alert('Fehler beim Wiederherstellen des Templates.');
    }
  };

  const handlePermanentDelete = async (id: string) => {
    try {
      await deleteTemplateForever(id);
      alert('Template wurde endgültig gelöscht!');
      fetchTrashedTemplates();
    } catch (error) {
      console.error('Fehler beim endgültigen Löschen des Templates:', error);
      alert('Fehler beim endgültigen Löschen des Templates.');
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
