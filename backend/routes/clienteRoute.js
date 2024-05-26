const express = require('express');
const { Cliente } = require('../models'); // Import the Cliente model

const router = express.Router();

// Route to fetch the numero_cliente
router.get('/cliente/:id', async (req, res) => {
  const clienteId = req.params.id;

  try {
    // Fetch the cliente data by ID
    const cliente = await Cliente.findOne({
      where: { id: clienteId },
      attributes: ['numero_cliente'] // Select only the numero_cliente field
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente not found' });
    }

    // Return the numero_cliente
    res.json({ numero_cliente: cliente.numero_cliente });
  } catch (error) {
    console.error('Error fetching cliente data:', error);
    res.status(500).json({ error: 'Error fetching cliente data' });
  }
});

module.exports = router;
