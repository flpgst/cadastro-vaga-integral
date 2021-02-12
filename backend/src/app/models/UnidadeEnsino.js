'use strict';

import Sequelize, { Model } from 'sequelize';

class UnidadeEnsino extends Model {
  static init(sequelize) {
    super.init(
      {
        nomeCompleto: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${this.unidadeEnsinoTipo.sigla} ${this.pessoa.nome}`;
          },
        },
      },
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
    this.belongsTo(models.unidadeEnsinoTipo, {
      as: 'unidadeEnsinoTipo',
      foreignKey: {
        type: Sequelize.INTEGER,
        field: 'tipo_id',
      },
    });
  }
}

export default UnidadeEnsino;
