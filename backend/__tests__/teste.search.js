const request = require('supertest');
const app = require('../index'); // Assuming your Express app file is named index.js
const { Cliente, Fatura } = require('../models'); // Import your Sequelize models

describe('GET /api/faturas/search/:numero_cliente', () => {
  it('responds with faturas associated with the provided numero_cliente', async () => {
    // Mock data
    const mockNumeroCliente = '123456789';
    const mockClienteId = 1;
    const mockFaturas = [
      { id: 1, cliente_id: mockClienteId, mes_referencia: "JAN/2023", energia_eletrica_kwh: "622.00", energia_eletrica_valor: "465.66", cliente: { id: mockClienteId, numero_cliente: "123456789", nome_cliente: "Unknown" } },
      { id: 2, cliente_id: mockClienteId, mes_referencia: "FEB/2023", energia_eletrica_kwh: "732.00", energia_eletrica_valor: "565.66", cliente: { id: mockClienteId, numero_cliente: "123456789", nome_cliente: "Unknown" } }
    ];

    // Mock database queries
    Cliente.findOne = jest.fn().mockResolvedValue({ id: mockClienteId });
    Fatura.findAll = jest.fn().mockResolvedValue(mockFaturas);

    // Send request to the endpoint
    const response = await request(app).get(`/api/faturas/search/${mockNumeroCliente}`);

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      faturas: mockFaturas.map(fatura => ({ ...fatura, cliente: { id: mockClienteId, numero_cliente: mockNumeroCliente, nome_cliente: "Unknown" } }))
    });
  });

  it('responds with 404 if no cliente found for the provided numero_cliente', async () => {
    // Mock data
    const mockNumeroCliente = '123456789';

    // Mock Cliente.findOne to return null
    Cliente.findOne = jest.fn().mockResolvedValue(null);

    // Send request to the endpoint
    const response = await request(app).get(`/api/faturas/search/${mockNumeroCliente}`);

    // Assert the response
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Cliente not found' });
  });

  it('responds with 404 if no faturas found for the provided numero_cliente', async () => {
    // Mock data
    const mockNumeroCliente = '123456789';
    const mockClienteId = 1;

    // Mock Cliente.findOne to return a cliente
    Cliente.findOne = jest.fn().mockResolvedValue({ id: mockClienteId });

    // Mock Fatura.findAll to return an empty array
    Fatura.findAll = jest.fn().mockResolvedValue([]);

    // Send request to the endpoint
    const response = await request(app).get(`/api/faturas/search/${mockNumeroCliente}`);

    // Assert the response
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'No faturas found for this cliente' });
  });

  it('responds with 500 if an error occurs during database query', async () => {
    // Mock data
    const mockNumeroCliente = '123456789';
    const errorMessage = 'Database error';

    // Mock Cliente.findOne to throw an error
    Cliente.findOne = jest.fn().mockRejectedValue(new Error(errorMessage));

    // Send request to the endpoint
    const response = await request(app).get(`/api/faturas/search/${mockNumeroCliente}`);

    // Assert the response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Error searching Faturas' });
  });
});
