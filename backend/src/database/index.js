import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import Pessoa from '../app/models/Pessoa';
import Usuario from '../app/models/Usuario';
import Atribuicao from '../app/models/Atribuicao';
import Grupo from '../app/models/Grupo';
import UnidadeEnsino from '../app/models/UnidadeEnsino';
import Inscricao from '../app/models/Inscricao';
import Matricula from '../app/models/Matricula';
import Endereco from '../app/models/Endereco';
import Cidade from '../app/models/Cidade';
import Estado from '../app/models/Estado';
import Pais from '../app/models/Pais';

const models = [
  Atribuicao,
  Grupo,
  Pessoa,
  Usuario,
  UnidadeEnsino,
  Inscricao,
  Matricula,
  Endereco,
  Cidade,
  Estado,
  Pais,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map((model) => model.init(this.connection));
    models.map(
      (model) => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
