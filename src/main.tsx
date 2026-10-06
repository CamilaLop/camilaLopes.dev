import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/editorial.css';
import './styles/title-reveal.css';
import App from './App';
import './styles/druk-titles.css';

createRoot(document.getElementById('root') as HTMLElement).render(<React.StrictMode><App /></React.StrictMode>);
