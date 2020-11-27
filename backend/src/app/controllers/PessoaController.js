import Pessoa from '../models/Pessoa';

class PessoaController {
  async index(req, res) {
    if (req.admin) return res.status(401).json({ message: 'Não Autorizado' });
    const { id } = req.params;
    const pessoa = await Pessoa.findOne({ where: { id } });
    return res.json(pessoa);
  }
}
export default new PessoaController();
