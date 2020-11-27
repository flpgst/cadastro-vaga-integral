import Parentesco from '../models/Parentesco';

class ParentescoController {
  async index(req, res) {
    if (!req.authorized) return res.status(401).json({ message: 'Não Autorizado' });
    
    return res.json(await Parentesco.findAll());
  }
}
export default new ParentescoController();
