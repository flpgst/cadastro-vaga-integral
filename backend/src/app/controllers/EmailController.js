import Mail from '../../lib/Mail';

class EmailController {
  async store(req, res) {
    const { enturmacao, inscricao } = req.body;

    const to =
      enturmacao.matricula.unidadeEnsino.id ===
      inscricao.matricula.unidadeEnsino.id
        ? enturmacao.matricula.unidadeEnsino.email
        : `${enturmacao.matricula.unidadeEnsino.email}, ${inscricao.matricula.unidadeEnsino.pessoa.email}`;

    Mail.sendMail({
      to,
      subject: 'Vaga Integral Concedida',
      template: 'confirmation',
      context: {
        enturmacao,
      },
    });
    return res.json({ enturmacao, inscricao });
  }
}
export default new EmailController();
