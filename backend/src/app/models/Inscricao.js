'use strict';

import Sequelize, { Model } from 'sequelize';

class Inscricao extends Model {
  static init(sequelize) {
    super.init(
      {
        renda_percapta: Sequelize.NUMBER,
        transporte_proprio: Sequelize.STRING,
        vulnerabilidade_social: Sequelize.BOOLEAN,
        processo_judicial: Sequelize.STRING,
        posicao: Sequelize.INTEGER,
        deferido: Sequelize.BOOLEAN,
        matricula_id: Sequelize.INTEGER,
      },
      {
        modelName: 'inscricao',
        tableName: 'cvi_inscricao',
        sequelize,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.matricula, {
      foreignKey: 'matricula_id',
    });
  }
}
export default Inscricao;
