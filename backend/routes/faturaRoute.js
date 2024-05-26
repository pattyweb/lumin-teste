// faturaRoute.js

const express = require('express');
const router = express.Router();
const { Fatura, Cliente } = require('../models');

// Route to fetch the fatura details by ID
router.get('/faturas/:id', async (req, res) => {
  const faturaId = req.params.id;

  try {
    // Find the Fatura record by its ID and include the associated Cliente information
    const fatura = await Fatura.findByPk(faturaId, {
      include: [{ model: Cliente, as: 'cliente' }] // Eager load the associated Cliente
    });

    if (!fatura) {
      return res.status(404).json({ error: 'Fatura not found' });
    }

    // Respond with the Fatura record along with its associated Cliente information
    res.json({ fatura });
  } catch (error) {
    console.error('Error fetching Fatura:', error);
    res.status(500).json({ error: 'Error fetching Fatura' });
  }
});

// Route to search for faturas by numero_cliente
router.get('/faturas/search/:numero_cliente', async (req, res) => {
  const numeroCliente = req.params.numero_cliente;

  try {
    // Find the Cliente record by its numero_cliente
    const cliente = await Cliente.findOne({ where: { numero_cliente: numeroCliente } });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente not found' });
    }

    // Find all Faturas associated with the found Cliente
    const faturas = await Fatura.findAll({ where: { cliente_id: cliente.id } });

    if (!faturas || faturas.length === 0) {
      return res.status(404).json({ error: 'No faturas found for this cliente' });
    }

    // Respond with the faturas found, including cliente details
    res.json({ faturas: faturas.map(fatura => ({ ...fatura.toJSON(), cliente })) });
  } catch (error) {
    console.error('Error searching Faturas:', error);
    res.status(500).json({ error: 'Error searching Faturas' });
  }
});


module.exports = router;
