// Importando as bibliotecas necessárias
const express = require('express');
const router = express.Router();
const { Fatura, Cliente } = require('../models');

// Endpoint para obter os dados do dashboard
router.get('/dashboard-data', async (req, res) => {
    const { numero_cliente } = req.query;

    try {
        // Verifica se foi fornecido um número de cliente
        if (!numero_cliente) {
            return res.status(400).json({ error: 'Número do cliente não fornecido' });
        }

        // Encontra o cliente com base no número fornecido
        const cliente = await Cliente.findOne({ where: { numero_cliente } });

        // Verifica se o cliente existe
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        // Encontra todas as faturas associadas ao cliente
        const faturas = await Fatura.findAll({ where: { cliente_id: cliente.id } });

        // Verifica se foram encontradas faturas para o cliente
        if (!faturas || faturas.length === 0) {
            return res.status(404).json({ error: 'Nenhuma fatura encontrada para este cliente' });
        }

        // Mapeia os dados das faturas para o formato desejado para o dashboard
        const dashboardData = faturas.map(fatura => ({
            mes_referencia: fatura.mes_referencia,
            consumo_energia_kwh: parseFloat(fatura.energia_eletrica_kwh),
            valor_total_r: parseFloat(fatura.energia_eletrica_valor) + parseFloat(fatura.energia_sceee_valor) + parseFloat(fatura.contribu_ilum_publica_valor),
            energia_compensada_kwh: parseFloat(fatura.energia_compensada_kwh),
            economia_gd_r: parseFloat(fatura.energia_compensada_valor)
        }));

        // Retorna os dados do dashboard
        res.json({ dashboardData });
    } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
    }
});

module.exports = router;
