// src/components/TemplateList.tsx
import React, { useState, useEffect } from 'react';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Pagination,
  TextField,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemSecondaryAction,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  fetchTemplates,
  deleteTemplate,
  assignTag,
  removeTag,
} from '../api'; // Importiere die zentralen API-Funktionen

interface Template {
  id: string;
  name: string;
  vendor: string;
  tags: string[];
}

const TemplateList: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [vendorFilter, setVendorFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [showOffiziell, setShowOffiziell] = useState(false);
  const [showVerifiziert, setShowVerifiziert] = useState(false);
  const [vendors] = useState<string[]>(['Cisco', 'Juniper', 'HP']);
  const [assignTagDialogOpen, setAssignTagDialogOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [tagToAssign, setTagToAssign] = useState('');
  const [password, setPassword] = useState('');
  const [removeTagDialogOpen, setRemoveTagDialogOpen] = useState(false);
  const [selectedTemplateIdForRemoval, setSelectedTemplateIdForRemoval] = useState<string>('');
  const [tagToRemove, setTagToRemove] = useState('');
  const [availableTagsToRemove, setAvailableTagsToRemove] = useState<string[]>([]);

  useEffect(() => {
    fetchTemplatesList();
  }, [page, vendorFilter, nameFilter, showOffiziell, showVerifiziert]);

  const fetchTemplatesList = async () => {
    try {
      const params = {
        page,
        limit: 5,
        vendor: vendorFilter || undefined,
        name: nameFilter || undefined,
        offiziell: showOffiziell,
        verifiziert: showVerifiziert,
      };
      const data = await fetchTemplates(params);
      setTemplates(data.templates);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Fehler beim Laden der Templates:', error);
    }
  };

  const moveToTrash = async (id: string) => {
    try {
      await deleteTemplate(id);
      fetchTemplatesList();
    } catch (error) {
      console.error('Fehler beim Verschieben in den Papierkorb:', error);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleAssignTag = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setAssignTagDialogOpen(true);
  };

  const handleAssignTagSubmit = async () => {
    try {
      await assignTag(selectedTemplateId, tagToAssign.toLowerCase(), password);
      alert('Tag erfolgreich zugewiesen!');
      setAssignTagDialogOpen(false);
      setPassword('');
      fetchTemplatesList();
    } catch (error) {
      console.error('Fehler beim Zuweisen des Tags:', error);
      alert('Fehler beim Zuweisen des Tags.');
    }
  };

  const handleRemoveTag = (templateId: string, currentTags: string[]) => {
    setSelectedTemplateIdForRemoval(templateId);
    setAvailableTagsToRemove(currentTags || []);
    setRemoveTagDialogOpen(true);
  };

  const handleRemoveTagSubmit = async () => {
    try {
      await removeTag(selectedTemplateIdForRemoval, tagToRemove.toLowerCase(), password);
      alert('Tag erfolgreich entfernt!');
      setRemoveTagDialogOpen(false);
      setPassword('');
      fetchTemplatesList();
    } catch (error) {
      console.error('Fehler beim Entfernen des Tags:', error);
      alert('Fehler beim Entfernen des Tags.');
    }
  };

  return (
    <div>
      <h2>Templates</h2>
      <Button variant="contained" color="primary" component={Link} to="/create-template">
        Neues Template erstellen
      </Button>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
        <FormControl style={{ minWidth: 120, marginRight: '1rem' }}>
          <InputLabel id="vendor-filter-label">Hersteller</InputLabel>
          <Select
            labelId="vendor-filter-label"
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
          >
            <MenuItem value="">
              <em>Alle</em>
            </MenuItem>
            {vendors.map((vendor) => (
              <MenuItem key={vendor} value={vendor}>
                {vendor}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Name suchen"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          style={{ marginRight: '1rem' }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={showOffiziell}
              onChange={(e) => setShowOffiziell(e.target.checked)}
            />
          }
          label="Offiziell"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={showVerifiziert}
              onChange={(e) => setShowVerifiziert(e.target.checked)}
            />
          }
          label="Verifiziert"
        />
      </div>

      <List>
        {templates.map((template) => (
          <ListItem key={template.id}>
            <ListItemText
              primary={
                <>
                  {template.name}{' '}
                  {template.tags.includes('offiziell') && (
                    <Chip label="Offiziell" color="primary" size="small" />
                  )}
                  {template.tags.includes('verifiziert') && (
                    <Chip label="Verifiziert" color="success" size="small" />
                  )}
                </>
              }
              secondary={template.vendor}
            />
            <ListItemSecondaryAction>
              <Button
                variant="outlined"
                component={Link}
                to={`/apply/${template.id}`}
                style={{ marginRight: '0.5rem' }}
              >
                Anwenden
              </Button>
              <Button
                variant="outlined"
                component={Link}
                to={`/edit-template/${template.id}`}
                style={{ marginRight: '0.5rem' }}
              >
                Editieren
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleAssignTag(template.id)}
                style={{ marginRight: '0.5rem' }}
              >
                Tag zuweisen
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleRemoveTag(template.id, template.tags)}
                style={{ marginRight: '0.5rem' }}
              >
                Tag entfernen
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => moveToTrash(template.id)}
              >
                In Papierkorb
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
      />

      {/* Dialog zum Zuweisen von Tags */}
      <Dialog open={assignTagDialogOpen} onClose={() => setAssignTagDialogOpen(false)}>
        <DialogTitle>Tag zuweisen</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="tag-label">Tag</InputLabel>
            <Select
              labelId="tag-label"
              value={tagToAssign}
              onChange={(e) => setTagToAssign(e.target.value as string)}
            >
              <MenuItem value="offiziell">Offiziell</MenuItem>
              <MenuItem value="verifiziert">Verifiziert</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Passwort"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignTagDialogOpen(false)}>Abbrechen</Button>
          <Button variant="contained" color="primary" onClick={handleAssignTagSubmit}>
            Tag zuweisen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog zum Entfernen von Tags */}
      <Dialog open={removeTagDialogOpen} onClose={() => setRemoveTagDialogOpen(false)}>
        <DialogTitle>Tag entfernen</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="remove-tag-label">Tag</InputLabel>
            <Select
              labelId="remove-tag-label"
              value={tagToRemove}
              onChange={(e) => setTagToRemove(e.target.value as string)}
            >
              {availableTagsToRemove.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Passwort"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveTagDialogOpen(false)}>Abbrechen</Button>
          <Button variant="contained" color="primary" onClick={handleRemoveTagSubmit}>
            Tag entfernen
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TemplateList;
