'use strict';
module.exports = (sequelize, DataTypes) => {
  const Fatura = sequelize.define('Fatura', {
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cliente',
        key: 'id',
      }
    },
    mes_referencia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    energia_eletrica_kwh: DataTypes.DECIMAL(10, 2),
    energia_eletrica_valor: DataTypes.DECIMAL(10, 2),
    energia_sceee_kwh: DataTypes.DECIMAL(10, 2),
    energia_sceee_valor: DataTypes.DECIMAL(10, 2),
    energia_compensada_kwh: DataTypes.DECIMAL(10, 2),
    energia_compensada_valor: DataTypes.DECIMAL(10, 2),
    contribu_ilum_publica_valor: DataTypes.DECIMAL(10, 2), // Corrected column name
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    tableName: 'faturas',
    timestamps: false
  });

  Fatura.associate = function(models) {
    Fatura.belongsTo(models.Cliente, {
      foreignKey: 'cliente_id',
      as: 'cliente'
    });
  };

  return Fatura;
};
