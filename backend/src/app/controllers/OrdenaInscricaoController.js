import Inscricao from '../models/Inscricao';
import ErrorHandler from '../util/error';
import ordernaInscricoes from '../util/order';
import Matricula from '../models/Matricula';
import Pessoa from '../models/Pessoa';
import ProcessoInscricao from '../models/ProcessoInscricao';
import UnidadeEnsino from '../models/UnidadeEnsino';

class OrdenarInscricaoController {
  async update(req, res, next) {
    try {
      if (!req.superAdmin) {
        throw new ErrorHandler(401, 'Não autorizado');
      }

      const getInscricoes = async () =>
        await Inscricao.findAll({
          where: {
            ativo: true,
          },
          include: [
            ProcessoInscricao,
            {
              model: Matricula,
              include: [
                { model: Pessoa, nested: true, all: true },
                { model: UnidadeEnsino, include: Pessoa },
              ],
            },
          ],
          order: ['posicao'],
        });

      let inscricoes = await getInscricoes();

      let inscricoesOrdenadas = ordernaInscricoes(
        inscricoes.map(({ dataValues }) => dataValues)
      );

      inscricoesOrdenadas.map(async ({ id }, index) => {
        await Inscricao.update({ posicao: index + 1 }, { where: id });
      });

      res.json(await getInscricoes());
    } catch (error) {
      next(error);
    }
  }
}

export default new OrdenarInscricaoController();
