'use strict';

import Sequelize, { Model } from 'sequelize';

class UnidadeEnsinoTipo extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        sigla: Sequelize.STRING,
      },
      {
        modelName: 'unidadeEnsinoTipo',
        tableName: 'edu_unidade_ensino_tipo',
        sequelize,
      }
    );
  }
}
export default UnidadeEnsinoTipo;
