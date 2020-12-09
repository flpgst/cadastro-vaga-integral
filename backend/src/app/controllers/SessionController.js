import jwt from 'jsonwebtoken';

import Usuario from '../models/Usuario';
import Atribuicao from '../models/Atribuicao';
import Grupo from '../models/Grupo';
import authConfig from '../../config/auth';
import ErrorHandler from '../util/error';

class SessionController {
  async store(req, res, next) {
    try {
      const { login, senha } = req.body;

      const user = await Usuario.findOne({
        where: { nome_usuario: login },
        include: [
          {
            model: Atribuicao,
            where: { ativo: true },
            include: {
              model: Grupo,
            },
          },
        ],
      });

      if (!user) throw new ErrorHandler(401, 'Usuário inexistente');

      if (!user.checkPassword(senha))
        throw new ErrorHandler(401, 'Senha incorreta');

      const { id, nome_usuario, nome_exibicao } = user;

      return res.json({
        id,
        nome_usuario,
        nome_exibicao,
        permissao:
          user.dataValues.atribuicoes[0].dataValues.grupo.dataValues.nome,
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (error) {
      next(error);
    }
  }
}
export default new SessionController();
