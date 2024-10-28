// src/components/EditTemplateForm.tsx
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getTemplateById, updateTemplate } from '../api'; // Importiere die zentralen API-Funktionen

const EditTemplateForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [vendor, setVendor] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (id) {
      fetchTemplate();
    }
  }, [id]);

  const fetchTemplate = async () => {
    try {
      const template = await getTemplateById(id!);
      const { name, vendor, content } = template;
      setName(name);
      setVendor(vendor);
      setContent(content);
    } catch (error) {
      console.error('Fehler beim Laden des Templates:', error);
      alert('Fehler beim Laden des Templates.');
    }
  };

  const handleSubmit = async () => {
    try {
      const updatedTemplate = {
        name,
        vendor,
        content,
      };
      await updateTemplate(id!, updatedTemplate);
      alert('Template erfolgreich aktualisiert!');
      navigate('/templates');
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Templates:', error);
      alert('Fehler beim Aktualisieren des Templates.');
    }
  };

  return (
    <div>
      <Typography variant="h4">Template bearbeiten</Typography>
      <TextField
        label="Name"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="vendor-label">Hersteller</InputLabel>
        <Select
          labelId="vendor-label"
          value={vendor}
          onChange={(e) => setVendor(e.target.value as string)}
        >
          <MenuItem value="Cisco">Cisco</MenuItem>
          <MenuItem value="Arista">Arista</MenuItem>
          <MenuItem value="Juniper">Juniper</MenuItem>
          <MenuItem value="RAD">RAD</MenuItem>
          <MenuItem value="MikroTik">MikroTik</MenuItem>
          <MenuItem value="Ekinops">Ekinops</MenuItem>
          <MenuItem value="HP">HP</MenuItem>
          <MenuItem value="Custom">Custom</MenuItem>

          {/* Weitere Hersteller */}
        </Select>
      </FormControl>
      <TextField
        label="Inhalt"
        fullWidth
        margin="normal"
        multiline
        rows={10}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Speichern
      </Button>
    </div>
  );
};

export default EditTemplateForm;
