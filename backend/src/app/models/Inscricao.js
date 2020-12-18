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
        ativo: Sequelize.BOOLEAN,
        pessoa_criacao: {
          type: Sequelize.INTEGER,
          field: 'pessoa_criacao_id',
        },
        pessoa_modificacao: {
          type: Sequelize.INTEGER,
          field: 'pessoa_modificacao_id',
        },
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
    this.belongsTo(models.processoInscricao, {
      foreignKey: 'processo_inscricao_id',
    });
  }
}
export default Inscricao;
