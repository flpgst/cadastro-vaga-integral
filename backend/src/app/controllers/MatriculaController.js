import Matricula from '../models/Matricula';

class MatriculaController {
  async index(req, res) {
    if (!req.authorized)
      return res.status(401).json({ message: 'Não Autorizado' });

    const { id } = req.params;

    const matricula = await Matricula.findOne({
      where: { id },
      include: { all: true, nested: true },
    });
    if (!req.superAdmin && matricula.id !== req.unidadeEnsinoId)
      return res
        .status(401)
        .json({ message: 'Esta matrícula não está na sua unidade' });

    return res.json(matricula);
  }
}
export default new MatriculaController();
