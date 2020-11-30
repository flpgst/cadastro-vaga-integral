'use strict';

import Sequelize, { Model } from 'sequelize';

class Estado extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        sigla: Sequelize.STRING,
      },
      {
        modelName: 'estado',
        tableName: 'sme_estado',
        sequelize,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.pais, {
      as: 'pais',
      foreignKey: {
        type: Sequelize.INTEGER,
        field: 'pais_id',
      },
    });
  }
}
export default Estado;
