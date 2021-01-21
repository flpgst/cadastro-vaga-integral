import Inscricao from '../models/Inscricao';
import ErrorHandler from '../util/error';
import { ordenaInscricoes, alteraPosicao } from '../util/order';
import Matricula from '../models/Matricula';
import Pessoa from '../models/Pessoa';
import ProcessoInscricao from '../models/ProcessoInscricao';
import UnidadeEnsino from '../models/UnidadeEnsino';
import MembroFamilia from '../models/MembroFamilia';
import Endereco from '../models/Endereco';
import Cidade from '../models/Cidade';
import Parentesco from '../models/Parentesco';

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
              model: MembroFamilia,
              include: [
                {
                  model: Endereco,
                  include: { model: Cidade, nested: true, all: true },
                },
                Parentesco,
              ],
            },
            {
              model: Matricula,
              include: [
                { model: Pessoa, nested: true, all: true },
                { model: UnidadeEnsino, include: Pessoa },
              ],
            },
          ],
          order: ['posicao', 'id'],
        });

      let inscricoes = await getInscricoes().catch((error) =>
        console.log('error >> ', error)
      );

      let inscricoesOrdenadas = ordenaInscricoes(
        inscricoes.map(({ dataValues }) => dataValues)
      );

      for await (let [index, { id }] of inscricoesOrdenadas.entries()) {
        await Inscricao.update({ posicao: index + 1 }, { where: { id } });
      }

      res.json(await getInscricoes());
    } catch (error) {
      next(error);
    }
  }

  async reordenar(req, res, next) {
    try {
      const { posicao } = req.body;
      const { id } = req.params;

      const getInscricoes = async () =>
        await Inscricao.findAll({
          where: { ativo: true },
          order: ['posicao'],
        });

      const inscricoes = alteraPosicao(await getInscricoes(), id, posicao);

      for await (const { posicao, id } of inscricoes) {
        await Inscricao.update({ posicao }, { where: { id } });
      }

      return res.json(await getInscricoes());
    } catch (error) {
      next(error);
    }
  }
}

export default new OrdenarInscricaoController();
