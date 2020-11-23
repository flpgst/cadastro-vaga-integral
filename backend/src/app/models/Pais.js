'use strict';

import Sequelize, { Model } from 'sequelize';

class Pais extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
      },
      {
        modelName: 'pais',
        tableName: 'sme_pais',
        sequelize,
      }
    );
  }
}
export default Pais;
