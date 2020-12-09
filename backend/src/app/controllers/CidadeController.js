import Cidade from '../models/Cidade';

class CidadeController {
  async index(req, res) {
    const { estado_id } = req.query;
    const cidades = await Cidade.findAll({
      where: { estado_id },
      include: { all: true, nested: true },
    });

    return res.json(cidades);
  }
}
export default new CidadeController();
