// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage'; // Neue Komponente
import TemplateList from './components/TemplateList';
import TemplateForm from './components/TemplateForm';
import EditTemplateForm from './components/EditTemplateForm';
import ConfigGenerator from './components/ConfigGenerator';
import TrashList from './components/TrashList'; // Neue Komponente
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/templates" element={<TemplateList />} />
        <Route path="/create-template" element={<TemplateForm />} />
        <Route path="/edit-template/:id" element={<EditTemplateForm />} />
        <Route path="/apply/:templateId" element={<ConfigGenerator />} />
        <Route path="/trash" element={<TrashList />} />
      </Routes>
    </Router>
  );
};

export default App;
