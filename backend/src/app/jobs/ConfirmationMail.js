// import { format, parseISO } from 'date-fns';
// import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail.js';

class ConfirmationMail {
  get key() {
    return 'ConfirmationMail';
  }

  async handle({ data }) {
    const enturmacao = data.enturmacao;

    await Mail.sendMail({
      to: `${enturmacao.turma.unidadeEnsino.nomeCompleto} <filipe@edu.itajai.sc.gov.br>`,
      subject: 'Vaga Integral Concedida',
      template: 'confirmation',
      context: {
        enturmacao,
        // program: enrollment.program,
        // end_date: format(
        //   parseISO(enrollment.end_date),
        //   "'dia' dd 'de' MMMM 'de' yyyy",
        //   {
        //     locale: pt,
        //   }
        // ),
      },
    });
  }
}

export default new ConfirmationMail();
