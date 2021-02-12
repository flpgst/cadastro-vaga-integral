import UnidadeEnsino from '../models/UnidadeEnsino';
import UnidadeEnsinoTipo from '../models/UnidadeEnsinoTipo';
import Pessoa from '../models/Pessoa';

class UnidadeEnsinoController {
  async index(req, res) {
    const unidadesEnsino = await UnidadeEnsino.findAll({
      include: [
        {
          model: Pessoa,
          as: 'pessoa',
        },
        {
          model: UnidadeEnsinoTipo,
          where: { sigla: 'UC' },
          as: 'unidadeEnsinoTipo',
        },
      ],
    });

    return res.json(unidadesEnsino);
  }
}
export default new UnidadeEnsinoController();
