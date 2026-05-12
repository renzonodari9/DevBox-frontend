import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import Loading from '../../components/common/Loading/Loading';
import './ApiTester.css';

const ApiTester = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  const handleSend = async () => {
    if (!url.trim()) {
      setError('Ingresa una URL');
      return;
    }

    setLoading(true);
    setError('');
    setResponse(null);

    try {
      let parsedHeaders = {};
      try {
        parsedHeaders = headers ? JSON.parse(headers) : {};
      } catch (e) {
        setError('Headers JSON inválido');
        setLoading(false);
        return;
      }

      let parsedBody = undefined;
      if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        try {
          parsedBody = JSON.parse(body);
        } catch (e) {
          setError('Body JSON inválido');
          setLoading(false);
          return;
        }
      }

       const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/test/request`, {
        method,
        url,
        headers: parsedHeaders,
        body: parsedBody
      });

      if (result.data.success) {
        setResponse(result.data);
      } else {
        setError(result.data.error || 'Error en la petición');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2));
    } catch (err) {
      setError('Error al copiar');
    }
  };

  const getStatusClass = (status) => {
    if (status >= 200 && status < 300) return 'status-success';
    if (status >= 300 && status < 400) return 'status-redirect';
    if (status >= 400 && status < 500) return 'status-client-error';
    return 'status-server-error';
  };

  const renderJson = (data) => {
    const json = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    return json.split('\n').map((line, i) => (
      <div key={i} className="json-line">
        <span className="json-line-number">{i + 1}</span>
        <span dangerouslySetInnerHTML={{ __html: syntaxHighlight(line) }} />
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
      <h1 className="section-title">API Tester</h1>
      <p className="section-subtitle">Prueba y analiza APIs</p>

      <Card className="api-tester-card">
        <div className="request-row">
          <div className="method-selector">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="method-select"
            >
              {methods.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <input
            type="text"
            className="url-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.ejemplo.com/endpoint"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} variant="primary" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar →'}
          </Button>
        </div>

        <div className="request-config">
          <div className="config-section">
            <div className="config-header">
              <h4>Headers</h4>
            </div>
            <textarea
              className="config-textarea"
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              rows={4}
              placeholder='{"Content-Type": "application/json"}'
            />
          </div>

          {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
            <div className="config-section">
              <div className="config-header">
                <h4>Body</h4>
              </div>
              <textarea
                className="config-textarea"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                placeholder='{"key": "value"}'
              />
            </div>
          )}
        </div>
      </Card>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {loading && (
        <div className="loading-container">
          <Loading size="large" />
        </div>
      )}

      {response && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="response-meta">
            <div className={`status-badge ${getStatusClass(response.status)}`}>
              {response.status} {response.statusText}
            </div>
            <div className="duration-badge">
              {response.duration}ms
            </div>
            <Button
              onClick={() => handleCopy(response.data)}
              variant="secondary"
              size="small"
            >
              Copiar respuesta
            </Button>
          </div>

          <Card className="response-card">
            <div className="card-header">
              <h3>Respuesta</h3>
            </div>
            <div className="response-body">
              {renderJson(response.data)}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ApiTester;
