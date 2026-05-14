import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import './Base64Tool.css';

const Base64Tool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('encode');
  const [copied, setCopied] = useState(false);

  const handleEncode = async () => {
    if (!input) {
      setError('Ingresa texto para codificar');
      return;
    }

    setError('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/base64/encode`, {
        text: input
      });

      if (response.data.success) {
        setOutput(response.data.encoded);
      }
    } catch (err) {
      setError('Error al codificar');
    }
  };

  const handleDecode = async () => {
    if (!input) {
      setError('Ingresa texto para decodificar');
      return;
    }

    setError('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/base64/decode`, {
        encoded: input
      });

      if (response.data.success) {
        setOutput(response.data.decoded);
      } else {
        setError(response.data.error || 'Error al decodificar');
      }
    } catch (err) {
      setError('Base64 inválido');
    }
  };

  const handleCopy = async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Error al copiar');
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleSwap = () => {
    setInput(output);
    setOutput('');
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="section-title">Base64 Tool</h1>
      <p className="section-subtitle">Codifica y decodifica texto en Base64</p>

      <div className="base64-mode-toggle">
        <button
          className={`mode-btn ${mode === 'encode' ? 'active' : ''}`}
          onClick={() => setMode('encode')}
        >
          Encode
        </button>
        <button
          className={`mode-btn ${mode === 'decode' ? 'active' : ''}`}
          onClick={() => setMode('decode')}
        >
          Decode
        </button>
      </div>

      <div className="base64-layout">
        <Card className="base64-card">
          <div className="card-header">
            <h3>{mode === 'encode' ? 'Texto Original' : 'Base64 Input'}</h3>
            <Button onClick={handleClear} variant="secondary" size="small">
              Limpiar
            </Button>
          </div>
          <div className="card-body">
            <textarea
              className="base64-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'Ingresa texto para codificar...' : 'Ingresa Base64 para decodificar...'}
              rows={12}
            />
            <div className="base64-actions">
              <Button
                onClick={mode === 'encode' ? handleEncode : handleDecode}
                variant="primary"
              >
                {mode === 'encode' ? 'Codificar →' : '← Decodificar'}
              </Button>
            </div>
          </div>
        </Card>

        <button
          className="base64-swap"
          onClick={handleSwap}
          aria-label="Swap encode/decode mode"
        >
          <motion.div
            className="swap-icon"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ⇄
          </motion.div>
        </button>

        <Card className="base64-card">
          <div className="card-header">
            <h3>{mode === 'encode' ? 'Base64 Output' : 'Texto Decodificado'}</h3>
            {output && (
              <Button onClick={handleCopy} variant="secondary" size="small">
                {copied ? '✓ Copiado' : 'Copiar'}
              </Button>
            )}
          </div>
          <div className="card-body">
            {error && <div className="error-message">{error}</div>}
            {output ? (
              <pre className="base64-output">{output}</pre>
            ) : (
              <div className="empty-state">
                {mode === 'encode' ? 'El resultado codificado aparecerá aquí' : 'El texto decodificado aparecerá aquí'}
              </div>
            )}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default Base64Tool;
