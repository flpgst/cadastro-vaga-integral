'use strict';

import Sequelize, { Model } from 'sequelize';

class Endereco extends Model {
  static init(sequelize) {
    super.init(
      {
        logradouro: Sequelize.STRING,
        numero: Sequelize.INTEGER,
        complemento: Sequelize.STRING,
        referencia: Sequelize.STRING,
        bairro: Sequelize.STRING,
        cep: Sequelize.STRING,
      },
      {
        modelName: 'endereco',
        tableName: 'sme_endereco',
        sequelize,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.cidade, {
      foreignKey: {
        type: Sequelize.INTEGER,
        field: 'cidade_id',
      },
    });
  }
}
export default Endereco;
