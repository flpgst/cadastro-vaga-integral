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
    this.belongsToMany(models.grupo, {
      through: 'atribuicao',
    });
  }
}
export default Usuario;
