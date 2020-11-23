'use strict';

import Sequelize, { Model } from 'sequelize';

class Matricula extends Model {
  static init(sequelize) {
    super.init(
      {
        codigo: Sequelize.INTEGER,
      },
      {
        modelName: 'matricula',
        tableName: 'edu_matricula',
        sequelize,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.pessoa, {
      foreignKey: {
        name: 'pessoaId',
        type: Sequelize.INTEGER,
        field: 'pessoa_fisica_aluno_id',
      },
    });
    this.belongsTo(models.unidadeEnsino, {
      foreignKey: {
        name: 'unidadeEnsinoId',
        type: Sequelize.INTEGER,
        field: 'unidade_ensino_id',
      },
    });
  }
}

export default Matricula;
