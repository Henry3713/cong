// src/api.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Lade die API-Base-URL aus den Umgebungsvariablen oder verwende einen relativen Pfad
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

// Erstelle eine Axios-Instanz mit der Basis-URL
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Füge Interceptors hinzu, um Anfragen oder Antworten global zu bearbeiten
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Hier kannst du globale Fehlerbehandlungen hinzufügen
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API-Funktionen

// **Templates**
export const fetchTemplates = async (params?: any): Promise<{ templates: any[]; totalPages: number }> => {
  try {
    const response = await api.get('/templates', { params });
    return response.data;
  } catch (error) {
    console.error('Fehler beim Laden der Templates:', error);
    throw error;
  }
};

export const getTemplateById = async (id: string): Promise<any> => {
  try {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Fehler beim Laden des Templates mit ID ${id}:`, error);
    throw error;
  }
};

export const createTemplate = async (template: object): Promise<any> => {
  try {
    const response = await api.post('/templates', template);
    return response.data;
  } catch (error) {
    console.error('Fehler beim Erstellen des Templates:', error);
    throw error;
  }
};

export const updateTemplate = async (id: string, template: object): Promise<any> => {
  try {
    const response = await api.put(`/templates/${id}`, template);
    return response.data;
  } catch (error) {
    console.error(`Fehler beim Aktualisieren des Templates mit ID ${id}:`, error);
    throw error;
  }
};

export const deleteTemplate = async (id: string): Promise<any> => {
  try {
    const response = await api.delete(`/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Fehler beim Löschen des Templates mit ID ${id}:`, error);
    throw error;
  }
};

// **Trash**
export const getTrash = async (): Promise<any[]> => {
  try {
    const response = await api.get('/templates/trash/all');
    return response.data;
  } catch (error) {
    console.error('Fehler beim Laden des Papierkorbs:', error);
    throw error;
  }
};

export const restoreTemplate = async (id: string): Promise<any> => {
  try {
    const response = await api.post(`/templates/trash/restore/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Fehler beim Wiederherstellen des Templates mit ID ${id}:`, error);
    throw error;
  }
};

export const deleteTemplateForever = async (id: string): Promise<any> => {
  try {
    const response = await api.delete(`/templates/trash/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Fehler beim endgültigen Löschen des Templates mit ID ${id}:`, error);
    throw error;
  }
};

// **Tags**
export const assignTag = async (id: string, tag: string, password: string): Promise<any> => {
  try {
    const response = await api.post(`/templates/${id}/assign-tag`, { tag, password });
    return response.data;
  } catch (error) {
    console.error(`Fehler beim Zuweisen des Tags "${tag}" zum Template mit ID ${id}:`, error);
    throw error;
  }
};

export const removeTag = async (id: string, tag: string, password: string): Promise<any> => {
  try {
    const response = await api.post(`/templates/${id}/remove-tag`, { tag, password });
    return response.data;
  } catch (error) {
    console.error(`Fehler beim Entfernen des Tags "${tag}" vom Template mit ID ${id}:`, error);
    throw error;
  }
};

// Weitere API-Funktionen können hier hinzugefügt werden

export default api;
