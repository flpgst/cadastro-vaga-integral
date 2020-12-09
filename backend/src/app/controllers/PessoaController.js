import Pessoa from '../models/Pessoa';

class PessoaController {
  async index(req, res) {
    const { id } = req.params;
    const pessoa = await Pessoa.findOne({ where: { id } });
    return res.json(pessoa);
  }
}
export default new PessoaController();
