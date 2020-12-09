import Estado from '../models/Estado';

class EstadoController {
  async index(req, res) {
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
