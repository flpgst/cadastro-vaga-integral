'use strict';

import Sequelize, { Model } from 'sequelize';

class Cidade extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
      },
      {
        modelName: 'cidade',
        tableName: 'sme_cidade',
        sequelize,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.estado, {
      foreignKey: {
        type: Sequelize.INTEGER,
        field: 'estado_id',
      },
    });
  }
}
export default Cidade;
