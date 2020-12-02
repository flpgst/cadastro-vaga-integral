'use strict';

import Sequelize, { Model } from 'sequelize';

class Atribuicao extends Model {
  static init(sequelize) {
    super.init(
      {
        unidadeEnsinoId: {
          type: Sequelize.INTEGER,
          field: 'instituicao_id',
        },
        ativo: Sequelize.BOOLEAN,
      },
      {
        modelName: 'atribuicao',
        name: {
          singular: 'atribuicao',
          plural: 'atribuicoes',
        },
        tableName: 'edu_acesso_atribuicao',
        sequelize,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.grupo, {
      foreignKey: {
        name: 'grupoId',
        type: Sequelize.INTEGER,
        field: 'grupo_id',
      },
    });
  }
}

export default Atribuicao;
