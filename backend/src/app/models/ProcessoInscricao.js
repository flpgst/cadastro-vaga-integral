'use strict';

import Sequelize, { Model } from 'sequelize';

class ProcessoInscricao extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        data_inicio: Sequelize.DATE,
        data_encerramento: Sequelize.DATE,
        encerrado: Sequelize.BOOLEAN,
        ativo: Sequelize.BOOLEAN,
      },
      {
        modelName: 'processoInscricao',
        tableName: 'cvi_processo_inscricao',
        sequelize,
      }
    );
  }
}
export default ProcessoInscricao;
