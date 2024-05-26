'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define('Cliente', {
    numero_cliente: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nome_cliente: {
      type: DataTypes.STRING,
    }
  }, {
    tableName: 'clientes',
    timestamps: false
  });

  Cliente.associate = function(models) {
    // associations can be defined here
    Cliente.hasMany(models.Fatura, {
      foreignKey: 'cliente_id',
      as: 'faturas'
    });
  };

  return Cliente;
};
