import Endereco from '../models/Endereco';
import Inscricao from '../models/Inscricao';
import MembroFamilia from '../models/MembroFamilia';
import { findInscricao, findMatriculaById } from '../util/finders';

class InscricaoController {
  async store(req, res) {
    if (!req.authorized)
      return res.status(401).json({ message: 'Não Autorizado' });

    const inscricao = req.body;
    const matricula = await findMatriculaById(inscricao.matricula_id);

    if (
      !req.superAdmin &&
      req.unidadeEnsinoId !== matricula.dataValues.unidade_ensino_id
    )
      return res.status(401).json({
        message: 'Você não tem permissão para cadastrar esta matrícula',
      });

    if (await findInscricao(inscricao.matricula_id))
      return res
        .status(400)
        .json({ message: 'Já existe uma inscrição para esta matrícula' });

    try {
      const inscricaoCreated = await Inscricao.create(inscricao).then(
        ({ dataValues }) => {
          inscricao.membros.map(async (membro) => {
            console.log('Log do endereco ', membro.endereco);
            const endereco = membro.endereco
              ? await Endereco.create(membro.endereco)
              : 'bata';
            console.log('endereco criado', endereco);
            await MembroFamilia.create({
              ...membro,
              inscricao_id: dataValues.id,
              endereco_id:
                endereco?.id ||
                matricula.dataValues.pessoa.dataValues.endereco.dataValues.id,
            });
          });
        }
      );

      return res.json(inscricaoCreated);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Ocorreu um erro. Tente Novamente' });
    }
  }
}
export default new InscricaoController();
