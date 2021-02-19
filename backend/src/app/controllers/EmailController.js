import Mail from '../../lib/Mail';

class EmailController {
  async store(req, res) {
    const { enturmacao, inscricao } = req.body;

    Mail.sendMail({
      to: `${enturmacao.matricula.unidadeEnsino.email}, ${inscricao.matricula.unidadeEnsino.pessoa.email}`,
      subject: 'Vaga Integral Concedida',
      template: 'confirmation',
      context: {
        enturmacao,
      },
    });
    return res.json(enturmacao);
  }
}
export default new EmailController();
