'use strict';

import Sequelize, { Model } from 'sequelize';

class MembroFamilia extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        local_trabalho: Sequelize.STRING,
        horario_trabalho_inicio: Sequelize.STRING,
        horario_trabalho_fim: Sequelize.STRING,
        telefone_trabalho: Sequelize.STRING,
        renda: Sequelize.NUMBER,
        cpf: Sequelize.STRING,
        certidao_nascimento: Sequelize.STRING,
        pis_pasep: Sequelize.STRING,
      },
      {
        modelName: 'membroFamilia',
        tableName: 'cvi_membro_familia',
        sequelize,
      }
    );
  }
  static associate(models) {
    this.belongsTo(models.inscricao, {
      foreignKey: 'inscricao_id',
    });
    this.belongsTo(models.endereco, {
      foreignKey: 'endereco_id',
    });
    this.belongsTo(models.parentesco, {
      foreignKey: 'parentesco_id',
    });
  }
}
export default MembroFamilia;
