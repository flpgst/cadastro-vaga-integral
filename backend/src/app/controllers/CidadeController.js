import Cidade from '../models/Cidade';

class CidadeController {
  async index(req, res) {
    if (!req.authorized)
      return res.status(401).json({ message: 'Não Autorizado' });

    const { estado_id } = req.query;
    const cidades = await Cidade.findAll({
      where: { estado_id },
      include: { all: true, nested: true },
    });

    return res.json(cidades);
  }
}
export default new CidadeController();
