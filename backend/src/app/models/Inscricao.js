'use strict';

import Sequelize, { Model } from 'sequelize';
import { createProtocol } from '../util/generators';

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
        protocolo: Sequelize.INTEGER,
      },
      {
        hooks: {
          afterSave: (inscricao) => {
            this.update(
              { protocolo: createProtocol(inscricao.id) },
              {
                where: {
                  id: inscricao.id,
                },
              }
            );
          },
        },
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
    this.hasMany(models.membroFamilia, {
      foreignKey: 'inscricao_id',
    });
  }
}
export default Inscricao;
