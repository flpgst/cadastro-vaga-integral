import Matricula from '../models/Matricula';
import ErrorHandler from '../util/error';

class MatriculaController {
  async index(req, res, next) {
    try {
      if (!req.authorized)
        return res.status(401).json({ message: 'Não Autorizado' });

      const { codigo } = req.query;

      const matricula = await Matricula.findOne({
        where: { codigo },
        include: { all: true, nested: true },
      });

      if (!matricula) {
        throw new ErrorHandler(500, 'Não existe Matricula');
      }
      if (!req.superAdmin && matricula.unidadeEnsinoId !== req.unidadeEnsinoId)
        return res
          .status(401)
          .json({ message: 'Esta matrícula não está na sua unidade' });

      return res.json(matricula);
    } catch (error) {
      next(error);
    }
  }
}
export default new MatriculaController();
