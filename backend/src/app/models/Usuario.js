'use strict';

import Sequelize, { Model } from 'sequelize';
import Crypto from 'crypto-js';

class Usuario extends Model {
  static init(sequelize) {
    super.init(
      {
        nome_exibicao: Sequelize.STRING,
        nome_usuario: Sequelize.STRING,
        email: Sequelize.STRING,
        senha: Sequelize.STRING,
        ativo: Sequelize.BOOLEAN,
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
        modelName: 'usuario',
        tableName: 'edu_acesso_usuario',
        sequelize,
      }
    );
  }
  checkPassword(password) {
    return Crypto.MD5(password).toString() === this.senha;
  }
  static associate(models) {
    this.hasMany(models.atribuicao, {
      foreignKey: {
        name: 'usuarioId',
        type: Sequelize.INTEGER,
        field: 'usuario_id',
      },
    });
  }
}
export default Usuario;
