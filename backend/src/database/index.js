import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import Pessoa from '../app/models/Pessoa';
import Usuario from '../app/models/Usuario';
import Atribuicao from '../app/models/Atribuicao';
import Grupo from '../app/models/Grupo';
import UnidadeEnsino from '../app/models/UnidadeEnsino';
import UnidadeEnsinoTipo from '../app/models/UnidadeEnsinoTipo';
import Inscricao from '../app/models/Inscricao';
import Matricula from '../app/models/Matricula';
import Etapa from '../app/models/Etapa';
import Endereco from '../app/models/Endereco';
import Cidade from '../app/models/Cidade';
import Estado from '../app/models/Estado';
import Pais from '../app/models/Pais';
import MembroFamilia from '../app/models/MembroFamilia';
import Parentesco from '../app/models/Parentesco';
import ProcessoInscricao from '../app/models/ProcessoInscricao';

const models = [
  Atribuicao,
  Grupo,
  Pessoa,
  Usuario,
  UnidadeEnsino,
  UnidadeEnsinoTipo,
  Inscricao,
  Matricula,
  Etapa,
  Endereco,
  Cidade,
  Estado,
  Pais,
  MembroFamilia,
  Parentesco,
  ProcessoInscricao,
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
