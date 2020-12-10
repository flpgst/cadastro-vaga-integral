import Matricula from '../models/Matricula';
import Inscricao from '../models/Inscricao';
import ErrorHandler from '../util/error';

class MatriculaController {
  async index(req, res, next) {
    try {
      const { codigo } = req.query;

      const matricula = await Matricula.findOne({
        where: { codigo },
        include: { all: true, nested: true },
      });

      if (!matricula) {
        throw new ErrorHandler(400, 'Matrícula inexistente');
      }
      if (!req.superAdmin && matricula.unidadeEnsinoId !== req.unidadeEnsinoId)
        throw new ErrorHandler(
          500,
          'Esta matrícula não pertence a sua unidade escolar'
        );

      return res.json(matricula);
    } catch (error) {
      next(error);
    }
  }

  async getInscricao(req, res, next) {
    try {
      const { codigo } = req.params;

      const matricula = await Matricula.findOne({
        where: { codigo, ativo: true },
      });

      if (!matricula) throw new ErrorHandler(400, 'Matrícula inexistente');

      const inscricao = await Inscricao.findOne({
        where: { matricula_id: matricula.id, ativo: true },
      });

      return inscricao ? res.status(200).json(inscricao) : res.end();
    } catch (error) {
      next(error);
    }
  }
}
export default new MatriculaController();
