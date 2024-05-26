'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('faturas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cliente_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'clientes',
          key: 'id'
        }
      },
      mes_referencia: {
        type: Sequelize.STRING,
        allowNull: false
      },
      energia_eletrica_kwh: {
        type: Sequelize.DECIMAL(10, 2)
      },
      energia_eletrica_valor: {
        type: Sequelize.DECIMAL(10, 2)
      },
      energia_sceee_kwh: {
        type: Sequelize.DECIMAL(10, 2)
      },
      energia_sceee_valor: {
        type: Sequelize.DECIMAL(10, 2)
      },
      energia_compensada_kwh: {
        type: Sequelize.DECIMAL(10, 2)
      },
      energia_compensada_valor: {
        type: Sequelize.DECIMAL(10, 2)
      },
      contribu_ilum_publica_valor: {
        type: Sequelize.DECIMAL(10, 2)
      },
      data_criacao: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('faturas');
  }
};
