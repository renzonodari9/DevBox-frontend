import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card/Card';
import './Home.css';

const features = [
  {
    title: 'JSON Formatter',
    description: 'Valida, formatea y colorea tu JSON con resaltado tipo VSCode',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        <rect x="7" y="7" width="10" height="10" rx="1"/>
      </svg>
    ),
    path: '/json-formatter',
    color: '#3b82f6'
  },
  {
    title: 'JWT Decoder',
    description: 'Decodifica y analiza JSON Web Tokens fácilmente',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    path: '/jwt-decoder',
    color: '#8b5cf6'
  },
  {
    title: 'Base64 Tool',
    description: 'Codifica y decodifica texto en Base64 al instante',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
        <line x1="14" y1="4" x2="10" y2="20"/>
      </svg>
    ),
    path: '/base64',
    color: '#10b981'
  },
  {
    title: 'API Tester',
    description: 'Prueba APIs con soporte para múltiples métodos HTTP',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    path: '/api-tester',
    color: '#f59e0b'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

const Home = () => {
  return (
    <motion.div
      className="page-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="hero-section" variants={itemVariants}>
        <h1 className="hero-title">
          <span className="gradient-text">DevBox</span>
        </h1>
        <p className="hero-subtitle">
          Herramientas modernas para desarrolladores
        </p>
        <p className="hero-description">
          Una suite completa de utilidades para agilizar tu flujo de trabajo como desarrollador.
          Todo en un solo lugar, con un diseño moderno y oscuro.
        </p>
      </motion.div>

      <motion.div className="features-grid" variants={containerVariants}>
        {features.map((feature, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Link to={feature.path} className="feature-link">
              <Card className="feature-card">
                <div className="feature-icon" style={{ color: feature.color }}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-arrow">→</div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Home;
