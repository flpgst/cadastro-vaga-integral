import Usuario from '../models/Usuario';
import Atribuicao from '../models/Atribuicao';
import Pessoa from '../models/Pessoa';
import ErrorHandler from '../util/error';

export default async (req, res, next) => {
  try {
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

    if (!user?.atribuicoes)
      throw new ErrorHandler(401, 'Usuário sem atribuição');

    req.pessoaId = pessoa.id;

    req.superAdmin =
      user.atribuicoes[0].dataValues.grupo.dataValues.nome ===
      'Super Administrador';
    req.gestor =
      user.atribuicoes[0].dataValues.grupo.dataValues.nome === 'Gestor';

    if (
      user.atribuicoes[0].dataValues.grupo.dataValues.nome !==
        'Super Administrador' &&
      user.atribuicoes[0].dataValues.grupo.dataValues.nome !== 'Secretário'
    ) {
      return res.status(401).json({ message: 'Não Autorizado' });
    }
    req.unidadeEnsinoId = user.atribuicoes[0].dataValues.unidadeEnsinoId;

    next();
  } catch (error) {
    next(error);
  }
};
