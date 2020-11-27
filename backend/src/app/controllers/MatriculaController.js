import Matricula from '../models/Matricula';

class MatriculaController {
  async index(req, res) {
    if (!req.authorized)
      return res.status(401).json({ message: 'Não Autorizado' });

    const { codigo } = req.query;

    const matricula = await Matricula.findOne({
      where: { codigo },
      include: { all: true, nested: true },
    });

    if (!matricula) {
      res.status(404).json({ message: 'Matrícula não existe' });
    }
    if (!req.superAdmin && matricula.unidadeEnsinoId !== req.unidadeEnsinoId)
      return res
        .status(401)
        .json({ message: 'Esta matrícula não está na sua unidade' });

    return res.json(matricula);
  }
}
export default new MatriculaController();
