import ProcessoInscricao from '../models/ProcessoInscricao';

class ProcessoInscricaoController {
  async index(req, res) {
    const processoInscricao = await ProcessoInscricao.findOne({
      where: { encerrado: false },
    });

    return processoInscricao ? res.json(processoInscricao) : res.end();
  }
}
export default new ProcessoInscricaoController();
