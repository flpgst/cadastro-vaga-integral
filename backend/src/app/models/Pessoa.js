'use strict';

import Sequelize, { Model } from 'sequelize';

class Pessoa extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        cpf_cnpj: Sequelize.STRING,
      },
      {
        modelName: 'pessoa',
        tableName: 'sme_pessoa',
        sequelize,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.endereco, {
      foreignKey: {
        name: 'enderecoId',
        type: Sequelize.INTEGER,
        field: 'endereco_id',
      },
    });
  }
}
export default Pessoa;
