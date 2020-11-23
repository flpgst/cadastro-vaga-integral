import Usuario from '../models/Usuario';
import Grupo from '../models/Grupo';

export default async (req, res, next) => {
  const user = await Usuario.findOne({
    where: {
      id: req.userId,
    },
    include: [
      {
        model: Grupo,
        attributes: ['nome'],
      },
    ],
  });

  req.superAdmin = user.grupos[0].dataValues.nome === 'Super Administrador';
  if (
    user.grupos[0].dataValues.nome === 'Super Administrador' ||
    user.grupos[0].dataValues.nome === 'Secretario'
  ) {
    req.authorized = true;
    req.unidadeEnsinoId =
      user.grupos[0].dataValues.atribuicao.dataValues.unidadeEnsinoId;
  }
  next();
};
