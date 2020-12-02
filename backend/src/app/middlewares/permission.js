import Usuario from '../models/Usuario';
import Atribuicao from '../models/Atribuicao';

export default async (req, res, next) => {
  const user = await Usuario.findOne({
    where: {
      id: req.userId,
    },
    include: [
      {
        model: Atribuicao,
        where: { ativo: true },
        nested: true,
        all: true,
      },
    ],
  });

  req.superAdmin =
    user.atribuicoes[0].dataValues.grupo.dataValues.nome ===
    'Super Administrador';
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
