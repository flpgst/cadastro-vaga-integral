'use strict';

import Sequelize, { Model } from 'sequelize';

class Etapa extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        data_cadastro: {
          type: Sequelize.DATE,
          field: 'data_cadastro',
        },
        data_modificacao: {
          type: Sequelize.DATE,
          field: 'data_modificacao',
        },
      },
      {
        modelName: 'etapa',
        tableName: 'edu_etapa',
        sequelize,
      }
    );
  }
}

export default Etapa;
