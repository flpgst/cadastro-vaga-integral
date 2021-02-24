'use strict';

import Sequelize, { Model } from 'sequelize';

class Matricula extends Model {
  static init(sequelize) {
    super.init(
      {
        codigo: Sequelize.INTEGER,
        status: Sequelize.ENUM(
          'CURSANDO',
          'APROVADO',
          'REPROVADO',
          'TRANCADO',
          'ABANDONO',
          'FALECIDO',
          'CANCELADO',
          'MUDANCA_DE_CURSO'
        ),
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
    this.belongsTo(models.etapa, {
      foreignKey: {
        name: 'etapaId',
        type: Sequelize.INTEGER,
        field: 'etapa_id',
      },
    });
  }
}

export default Matricula;
