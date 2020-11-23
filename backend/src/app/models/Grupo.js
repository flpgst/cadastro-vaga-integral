'use strict';

import Sequelize, { Model } from 'sequelize';

class Grupo extends Model {
  static init(sequelize) {
    super.init(
      {
        nome_exibicao: Sequelize.STRING,
        ativo: Sequelize.BOOLEAN,
      },
      {
        modelName: 'grupo',
        tableName: 'edu_acesso_grupo',
        sequelize,
      }
    );
  }
  static associate(models) {
    this.belongsToMany(models.usuario, {
      through: 'atribuicao',
    });
  }
}
export default Grupo;
