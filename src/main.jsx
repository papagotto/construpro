import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// REESCRITOR DE RUTAS PARA INVITACIONES
// Este script captura el token de Supabase ANTES de que React Router lo borre.
const fixAuthHash = () => {
  const fullHash = window.location.hash;
  
  // Si recibimos un token que NO viene precedido por #/ (formato estándar de Supabase)
  if (fullHash && fullHash.includes('access_token=') && !fullHash.startsWith('#/')) {
    console.log('Transformando token de invitación para el Router...');
    
    // Convertimos #access_token=... en #/reset-password?access_token=...
    // Esto hace dos cosas:
    // 1. El HashRouter ve "#/reset-password" y sabe a qué página ir.
    // 2. Supabase ve el hash y extrae el token correctamente.
    const tokenData = fullHash.substring(1); // quitamos el primer #
    window.location.hash = `#/reset-password?${tokenData}`;
  }
};

fixAuthHash();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
