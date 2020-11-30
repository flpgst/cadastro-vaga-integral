import Estado from '../models/Estado';

class EstadoController {
  async index(req, res) {
    if (!req.authorized)
      return res.status(401).json({ message: 'Não Autorizado' });

    return res.json(
      await Estado.findAll({
        where: {
          paisId: 1,
        },
      })
    );
  }
}
export default new EstadoController();
