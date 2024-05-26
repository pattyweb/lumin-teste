import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dashboardData, setDashboardData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/dashboard-data?numero_cliente=${searchTerm}`);
        setDashboardData(response.data.dashboardData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    if (searchTerm !== '') {
      fetchData();
    }
  }, [searchTerm]);

  const createEnergyConsumptionChart = (data) => ({
    labels: data.map(item => item.mes_referencia),
    datasets: [
      {
        label: 'Consumo de Energia (kWh)',
        data: data.map(item => item.consumo_energia_kwh),
        fill: false,
        borderColor: 'blue',
      },
      {
        label: 'Energia Compensada (kWh)',
        data: data.map(item => item.energia_compensada_kwh),
        fill: false,
        borderColor: 'green',
      },
    ],
  });

  const createMonetaryValueChart = (data) => ({
    labels: data.map(item => item.mes_referencia),
    datasets: [
      {
        label: 'Valor Total (R$)',
        data: data.map(item => item.valor_total_r),
        fill: false,
        borderColor: 'purple',
      },
      {
        label: 'Economia Gerada (R$)',
        data: data.map(item => item.economia_gd_r),
        fill: false,
        borderColor: 'orange',
      },
    ],
  });

  return (
    <div className="container">
      <h2 className="mt-4">Dashboard</h2>
      <div className="mb-3">
        <label htmlFor="search" className="form-label">Procurar Nº DO CLIENTE:</label>
        <div className="d-flex">
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control me-2"
          />
          <button onClick={() => setSearchTerm(searchTerm)} className="btn btn-primary">Procurar</button>
        </div>
      </div>
      <div className="mb-4">
        <h3>Chart de Consumo de Energia</h3>
        <Line data={createEnergyConsumptionChart(dashboardData)} />
      </div>
      <div className="mb-4">
        <h3>Chart de Valor Monetário</h3>
        <Line data={createMonetaryValueChart(dashboardData)} />
      </div>
    </div>
  );
};

export default Dashboard;
