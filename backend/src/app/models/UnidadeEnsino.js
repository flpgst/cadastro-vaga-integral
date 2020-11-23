'use strict';

import { Model } from 'sequelize';

class UnidadeEnsino extends Model {
  static init(sequelize) {
    super.init(
      {},
      {
        modelName: 'unidadeEnsino',
        tableName: 'edu_unidade_ensino',
        sequelize,
      }
    );
  }
  static associate(models) {
    this.hasOne(models.pessoa, {
      foreignKey: 'id',
    });
  }
}

export default UnidadeEnsino;
