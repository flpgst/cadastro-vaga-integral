'use strict';

import Sequelize, { Model } from 'sequelize';

class Grupo extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        ativo: Sequelize.BOOLEAN,
      },
      {
        modelName: 'grupo',
        tableName: 'edu_acesso_grupo',
        sequelize,
      }
    );
  }
  // static associate(models) {
  //   this.hasOne(models.atribuicao, {
  //     foreignKey: {
  //       name: 'grupoId',
  //       type: Sequelize.INTEGER,
  //       field: 'grupo_id',
  //     },
  //   });
  // }
  // static associate(models) {
  //   this.belongsToMany(models.usuario, {
  //     through: 'atribuicao',
  //     hooks: true,
  //   });
  // }
}
export default Grupo;
