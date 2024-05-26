import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InvoicesPage from './components/InvoicesPage';
import Menu from './components/Menu'; // Certifique-se de que o caminho está correto
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div>
        <Menu />
        <Routes>
          <Route path="/faturas" element={<InvoicesPage />} />
          {/* Adicione outras rotas aqui */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<HomePage />} /> {/* Componente HomePage deve ser criado */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

