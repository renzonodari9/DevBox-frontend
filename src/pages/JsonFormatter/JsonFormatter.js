import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import './JsonFormatter.css';

const JsonFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFormat = async () => {
    if (!input.trim()) {
      setError('Ingresa un JSON para formatear');
      return;
    }

    setLoading(true);
    setError('');
    setOutput('');

    try {
       const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/json/format`, {
        json: input
      });

      if (response.data.success) {
        setOutput(response.data.formatted);
        setIsValid(true);
      } else {
        setError(response.data.error || 'Error al formatear');
        setIsValid(false);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error de conexión con el servidor');
      setIsValid(false);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!input.trim()) {
      setError('Ingresa un JSON para validar');
      return;
    }

    try {
       const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/json/validate`, {
        json: input
      });

      setIsValid(response.data.valid);
      setError(response.data.valid ? '' : response.data.error);
    } catch (err) {
      setIsValid(false);
      setError('Error de conexión');
    }
  };

  const handleCopy = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Error al copiar al portapapeles');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setIsValid(null);
  };

  const renderJsonWithColors = (json) => {
    if (!json) return '';
    return json.split('\n').map((line, i) => (
      <div key={i} className="json-line">
        <span className="json-line-number">{i + 1}</span>
        <span className="json-content" dangerouslySetInnerHTML={{ __html: syntaxHighlight(line) }} />
      </div>
    ));
  };

  const syntaxHighlight = (json) => {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = 'json-number';
        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? 'json-key' : 'json-string';
        } else if (/true|false/.test(match)) {
          cls = 'json-boolean';
        } else if (/null/.test(match)) {
          cls = 'json-null';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="section-title">JSON Formatter</h1>
      <p className="section-subtitle">Valida, formatea y colorea tu JSON</p>

      <div className="json-layout">
        <Card className="json-input-card">
          <div className="card-header">
            <h3>Entrada</h3>
            <div className="card-actions">
              <Button onClick={handleValidate} variant="secondary" size="small">
                Validar
              </Button>
              <Button onClick={handleClear} variant="secondary" size="small">
                Limpiar
              </Button>
            </div>
          </div>
          <div className="card-body">
            <textarea
              className="json-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Pega tu JSON aquí... (ej: {"name": "DevBox", "version": 1.0})'
              rows={15}
            />
            {isValid !== null && (
              <div className={`validation-status ${isValid ? 'valid' : 'invalid'}`}>
                {isValid ? '✓ JSON válido' : '✕ JSON inválido'}
              </div>
            )}
          </div>
        </Card>

        <div className="json-actions-center">
          <Button onClick={handleFormat} variant="primary" size="large" disabled={loading}>
            {loading ? 'Formateando...' : 'Formatear →'}
          </Button>
        </div>

        <Card className="json-output-card">
          <div className="card-header">
            <h3>Salida</h3>
            {output && (
              <Button onClick={handleCopy} variant="secondary" size="small" icon={copied ? '✓' : '⎘'}>
                {copied ? 'Copiado' : 'Copiar'}
              </Button>
            )}
          </div>
          <div className="card-body">
            {error && <div className="error-message">{error}</div>}
            {loading ? (
              <div className="loading-placeholder">Formateando...</div>
            ) : output ? (
              <pre className="json-output">{renderJsonWithColors(output)}</pre>
            ) : (
              <div className="empty-state">El JSON formateado aparecerá aquí</div>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default JsonFormatter;
