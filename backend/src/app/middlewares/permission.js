import Usuario from '../models/Usuario';
import Atribuicao from '../models/Atribuicao';
import Pessoa from '../models/Pessoa';

export default async (req, res, next) => {
  const user = await Usuario.findByPk(req.userId, {
    include: [
      {
        model: Atribuicao,
        where: { ativo: true },
        nested: true,
        all: true,
      },
    ],
  });

  const pessoa = await Pessoa.findOne({
    where: {
      usuario_id: req.userId,
    },
  });

  req.pessoaId = pessoa.id;

  req.superAdmin =
    user.atribuicoes[0].dataValues.grupo.dataValues.nome ===
    'Super Administrador';
  req.gestor =
    user.atribuicoes[0].dataValues.grupo.dataValues.nome === 'Gestor';

  if (
    user.atribuicoes[0].dataValues.grupo.dataValues.nome ===
      'Super Administrador' ||
    user.atribuicoes[0].dataValues.grupo.dataValues.nome === 'Secretario'
  ) {
    req.authorized = true;
    req.unidadeEnsinoId = user.atribuicoes[0].dataValues.unidadeEnsinoId;
  }
  next();
};
