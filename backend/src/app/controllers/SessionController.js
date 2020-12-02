import jwt from 'jsonwebtoken';

import Usuario from '../models/Usuario';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { login, senha } = req.body;

    const user = await Usuario.findOne({
      where: { nome_usuario: login },
    });

    if (!user) return res.status(401).json({ error: 'Usuário não existe' });

    if (!user.checkPassword(senha))
      return res.status(401).json({ error: 'Senha incorreta' });

    const { id, nome_usuario, nome } = user;

    return res.json({
      id,
      nome_usuario,
      nome,
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}
export default new SessionController();
