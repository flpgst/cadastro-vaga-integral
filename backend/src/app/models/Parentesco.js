'use strict';

import Sequelize, { Model } from 'sequelize';

class Parentesco extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
      },
      {
        modelName: 'parentesco',
        tableName: 'cvi_parentesco',
        sequelize,
      }
    );
  }
}
export default Parentesco;
