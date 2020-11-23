'use strict';

import Sequelize, { Model } from 'sequelize';

class Atribuicao extends Model {
  static init(sequelize) {
    super.init(
      {
        usuarioId: {
          type: Sequelize.INTEGER,
          field: 'usuario_id',
        },
        grupoId: {
          type: Sequelize.INTEGER,
          field: 'grupo_id',
        },
        unidadeEnsinoId: {
          type: Sequelize.INTEGER,
          field: 'instituicao_id',
        },
      },
      {
        modelName: 'atribuicao',
        tableName: 'edu_acesso_atribuicao',
        sequelize,
      }
    );
  }
}

export default Atribuicao;
