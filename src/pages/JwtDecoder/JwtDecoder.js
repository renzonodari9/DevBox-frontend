import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import { renderJson } from '../../utils/syntaxHighlight';
import './JwtDecoder.css';

const JwtDecoder = () => {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDecode = async () => {
    if (!token.trim()) {
      setError('Ingresa un JWT para decodificar');
      return;
    }

    setLoading(true);
    setError('');
    setDecoded(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/jwt/decode`, {
        token
      });

      if (response.data.success) {
        setDecoded(response.data);
      } else {
        setError(response.data.error || 'Error al decodificar');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(text, null, 2));
    } catch (err) {
      setError('Error al copiar');
    }
  };

  const handleClear = () => {
    setToken('');
    setDecoded(null);
    setError('');
};

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="section-title">JWT Decoder</h1>
      <p className="section-subtitle">Decodifica y analiza JSON Web Tokens</p>

      <Card className="jwt-input-card">
        <div className="jwt-input-wrapper">
          <textarea
            className="jwt-textarea"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Pega tu JWT aquí... (ej: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
            rows={4}
          />
          <div className="jwt-actions">
            <Button onClick={handleDecode} variant="primary" disabled={loading}>
              {loading ? 'Decodificando...' : 'Decodificar'}
            </Button>
            <Button onClick={handleClear} variant="secondary">
              Limpiar
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {decoded && (
        <motion.div
          className="jwt-results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="jwt-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Header</h3>
                <p className="card-subtitle">Información del algoritmo</p>
              </div>
              <Button
                onClick={() => handleCopy(decoded.header)}
                variant="secondary"
                size="small"
              >
                Copiar
              </Button>
            </div>
            <div className="jwt-code">
              {renderJson(decoded.header)}
            </div>
          </Card>

          <Card className="jwt-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Payload</h3>
                <p className="card-subtitle">Datos del token</p>
              </div>
              <Button
                onClick={() => handleCopy(decoded.payload)}
                variant="secondary"
                size="small"
              >
                Copiar
              </Button>
            </div>
            <div className="jwt-code">
              {renderJson(decoded.payload)}
            </div>
          </Card>

          {decoded.expiration && (
            <Card className="jwt-card jwt-expiration-card">
              <div className="card-header">
                <h3 className="card-title">Expiración</h3>
              </div>
              <div className="expiration-content">
                <div className="expiration-item">
                  <span className="expiration-label">Timestamp</span>
                  <span className="expiration-value">{decoded.expiration.timestamp}</span>
                </div>
                <div className="expiration-item">
                  <span className="expiration-label">Fecha</span>
                  <span className="expiration-value">{new Date(decoded.expiration.date).toLocaleString()}</span>
                </div>
                <div className="expiration-status">
                  <span className={`status-badge ${decoded.expiration.isValid ? 'valid' : 'expired'}`}>
                    {decoded.expiration.isValid ? '✓ Válido' : '✕ Expirado'}
                  </span>
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default JwtDecoder;
