import Inscricao from '../models/Inscricao';
import Matricula from '../models/Matricula';

export async function findInscricao(matricula) {
  const inscricao = await Inscricao.findOne({
    where: {
      matricula_id: matricula,
    },
  });
  return inscricao;
}
export async function findMatriculaById(id) {
  const matricula = await Matricula.findByPk(id, {
    include: { all: true, nested: true },
  });
  return matricula;
}
