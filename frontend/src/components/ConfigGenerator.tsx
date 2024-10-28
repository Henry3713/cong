// src/components/ConfigGenerator.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import Handlebars from 'handlebars';
import set from 'lodash/set';
import get from 'lodash/get';
import { getTemplateById } from '../api'; // Importiere die zentrale API-Funktion

interface FormField {
  name: string;
  type: 'text' | 'number' | 'pattern' | 'section' | 'loop';
  label: string;
  fields?: FormField[];
  path?: string[];
}

const ConfigGenerator: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [formFields, setFormFieldsState] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [generatedConfig, setGeneratedConfig] = useState('');
  const [templateContent, setTemplateContent] = useState('');

  useEffect(() => {
    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  useEffect(() => {
    // Custom Helpers nur einmal registrieren
    registerHelpers();
  }, []);

  const fetchTemplate = async () => {
    try {
      const template = await getTemplateById(templateId!);
      const { content } = template;
      setTemplateContent(content);
      parseTemplate(content);
      generateConfig(formData, content);
    } catch (error) {
      console.error('Fehler beim Laden des Templates:', error);
      alert('Fehler beim Laden des Templates.');
    }
  };

  const registerHelpers = () => {
    // Custom 'displayVar' Helper
    Handlebars.registerHelper('displayVar', function (variablePath, options) {
      let value = get(this, variablePath);

      if (value === undefined) {
        value = get(options.data.root, variablePath);
      }

      if (value === undefined || value === '') {
        return new Handlebars.SafeString(`<span style="color:red">{{${variablePath}}}</span>`);
      } else {
        return Handlebars.escapeExpression(value);
      }
    });
  };

  const parseTemplate = (content: string) => {
    const ast = Handlebars.parse(content);
    const fields: FormField[] = [];

    const traverse = (node: any, context: string[] = []) => {
      switch (node.type) {
        case 'Program':
          node.body.forEach((child: any) => traverse(child, context));
          break;
        case 'MustacheStatement':
          if (node.path.type === 'PathExpression') {
            const varName = [...context, ...node.path.parts].join('.');
            fields.push({
              name: varName,
              label: varName,
              type: 'text',
              path: [...context, ...node.path.parts],
            });
          }
          break;
        case 'BlockStatement':
          if (node.path.type === 'PathExpression') {
            if (node.path.original === 'if') {
              // Variable in der Bedingung hinzufügen
              const conditionVar = node.params[0];
              if (conditionVar.type === 'PathExpression') {
                const varName = [...context, ...conditionVar.parts].join('.');
                fields.push({
                  name: varName,
                  label: varName,
                  type: 'text',
                  path: [...context, ...conditionVar.parts],
                });
              }
              traverse(node.program, context);
              if (node.inverse) {
                traverse(node.inverse, context);
              }
            } else if (node.path.original === 'each') {
              const loopVar = node.params[0];
              if (loopVar.type === 'PathExpression') {
                const varName = [...context, ...loopVar.parts].join('.');
                const newContext = [...context, loopVar.original];
                traverse(node.program, newContext);

                // Sammle Felder innerhalb der Schleife
                const innerFields = fields.filter(
                  (f) =>
                    f.path &&
                    f.path.slice(0, newContext.length).join('.') === newContext.join('.') &&
                    f.path.length > newContext.length,
                );
                fields.push({
                  name: varName,
                  label: varName,
                  type: 'loop',
                  fields: innerFields.map((f) => ({
                    ...f,
                    name: f.name.replace(varName + '.', ''),
                    path: f.path ? f.path.slice(newContext.length) : [],
                  })),
                  path: [...context, loopVar.parts],
                });
              }
            }
          }
          break;
        default:
          if (node.program) {
            traverse(node.program, context);
          }
          if (node.inverse) {
            traverse(node.inverse, context);
          }
          break;
      }
    };

    traverse(ast);

    // Entferne Duplikate
    const uniqueFieldsMap = new Map<string, FormField>();
    fields.forEach((field) => {
      uniqueFieldsMap.set(field.name, field);
    });
    const uniqueFields = Array.from(uniqueFieldsMap.values());

    setFormFieldsState(uniqueFields);
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData((prevData) => {
      const newData = { ...prevData };
      set(newData, name, value);
      generateConfig(newData, templateContent);
      return newData;
    });
  };

  const generateConfig = (data: { [key: string]: any }, content: string) => {
    try {
      const template = Handlebars.compile(content);
      console.log('Aktuelles formData:', JSON.stringify(data, null, 2)); // Debugging
      const config = template(data);
      setGeneratedConfig(config);
    } catch (error) {
      console.error('Fehler beim Generieren der Konfiguration:', error);
      setGeneratedConfig('Fehler beim Generieren der Konfiguration.');
    }
  };

  const renderFormFields = (fields: FormField[], parentPath: string[] = []) => {
    return fields.map((field) => {
      const fullName = [...parentPath, field.name].join('.');
      if (field.type === 'text') {
        return (
          <TextField
            key={fullName}
            label={field.label}
            name={fullName}
            fullWidth
            margin="normal"
            onChange={(e) => handleInputChange(fullName, e.target.value)}
          />
        );
      } else if (field.type === 'number') {
        return (
          <TextField
            key={fullName}
            label={field.label}
            name={fullName}
            type="number"
            inputProps={{ min: 1 }}
            fullWidth
            margin="normal"
            onChange={(e) => handleInputChange(fullName, e.target.value)}
          />
        );
      } else if (field.type === 'loop') {
        const countName = `${fullName}_count`;
        const count = parseInt(get(formData, countName)) || 0;
        const loopFields = [];
        for (let i = 0; i < count; i++) {
          loopFields.push(
            <Paper key={`${fullName}_${i}`} style={{ padding: '1rem', marginBottom: '1rem' }}>
              <Typography variant="h6">
                {field.label} {i + 1}
              </Typography>
              {renderFormFields(
                field.fields || [],
                [...parentPath, field.name, String(i)],
              )}
            </Paper>
          );
        }
        return (
          <div key={fullName}>
            <TextField
              label={`Anzahl ${field.label}`}
              name={countName}
              type="number"
              inputProps={{ min: 1 }}
              fullWidth
              margin="normal"
              onChange={(e) => handleInputChange(countName, e.target.value)}
            />
            {loopFields}
          </div>
        );
      } else {
        return null;
      }
    });
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Konfiguration generieren
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          {renderFormFields(formFields)}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5">Generierte Konfiguration:</Typography>
          <pre
            style={{
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              padding: '1rem',
              overflowX: 'auto',
            }}
            dangerouslySetInnerHTML={{ __html: generatedConfig || templateContent }}
          />
          {generatedConfig && (
            <div style={{ marginTop: '1rem' }}>
              <Button
                variant="outlined"
                onClick={() => {
                  const element = document.createElement('a');
                  const file = new Blob([generatedConfig], { type: 'text/plain' });
                  element.href = URL.createObjectURL(file);
                  element.download = `config_${templateId}.txt`;
                  document.body.appendChild(element);
                  element.click();
                }}
                style={{ marginRight: '1rem' }}
              >
                Herunterladen
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  navigator.clipboard.writeText(generatedConfig).then(
                    () => {
                      alert('Konfiguration wurde in die Zwischenablage kopiert!');
                    },
                    (err) => {
                      console.error('Fehler beim Kopieren in die Zwischenablage:', err);
                    }
                  );
                }}
              >
                In Zwischenablage kopieren
              </Button>
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default ConfigGenerator;
