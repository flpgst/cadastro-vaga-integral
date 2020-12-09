import Parentesco from '../models/Parentesco';

class ParentescoController {
  async index(req, res) {
    return res.json(await Parentesco.findAll());
  }
}
export default new ParentescoController();
