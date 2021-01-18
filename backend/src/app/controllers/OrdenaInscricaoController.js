import Inscricao from '../models/Inscricao';
import ErrorHandler from '../util/error';
import ordernaInscricoes from '../util/order';

class MatriculaController {
  async update(req, res, next) {
    try {
      if (!req.superAdmin) {
        throw new ErrorHandler(401, 'Não autorizado');
      }

      const inscricoes = await Inscricao.findAll({
        where: {
          ativo: true,
        },
      });

      let inscricoesOrdenadas = ordernaInscricoes(
        inscricoes.map(({ dataValues }) => dataValues)
      );

      inscricoesOrdenadas = inscricoesOrdenadas.map((inscricao, index) => {
        Inscricao.update(
          { posicao: index + 1 },
          { where: { id: inscricao.id } }
        );
        return { ...inscricao, posicao: index + 1 };
      });

      res.json(inscricoesOrdenadas);
    } catch (error) {
      next(error);
    }
  }
}

export default new MatriculaController();
