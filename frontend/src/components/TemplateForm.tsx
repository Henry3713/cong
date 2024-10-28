// src/components/TemplateForm.tsx
import React, { useState } from 'react';
import { Button, TextField, Select, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createTemplate } from '../api'; // Importiere die zentrale API-Funktion

const TemplateForm: React.FC = () => {
  const [name, setName] = useState('');
  const [vendor, setVendor] = useState('');
  const [content, setContent] = useState('');

  const navigate = useNavigate();

  const exampleTemplate = `hostname {{hostname}}

interface {{interface_name}}
  ip address {{ip_address}} {{subnet_mask}}
  description {{description}}

{{#if enabled}}
  no shutdown
{{else}}
  shutdown
{{/if}}`;

  const handleSubmit = async () => {
    try {
      const newTemplate = {
        name,
        vendor,
        content,
      };
      await createTemplate(newTemplate); // Nutze die zentrale Funktion
      alert('Template erfolgreich erstellt!');
      navigate('/templates');
    } catch (error) {
      console.error('Fehler beim Erstellen des Templates:', error);
      alert('Fehler beim Erstellen des Templates.');
    }
  };

  return (
    <div>
      <Typography variant="h4">Neues Template erstellen</Typography>
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
        placeholder={exampleTemplate}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Speichern
      </Button>
    </div>
  );
};

export default TemplateForm;
