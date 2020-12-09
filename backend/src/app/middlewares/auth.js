import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';
import ErrorHandler from '../util/error';

export default async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) throw new ErrorHandler(401, 'Token não informado');

    const [, token] = authHeader.split(' ');

    try {
      const decoded = await promisify(jwt.verify)(token, authConfig.secret);
      req.userId = decoded.id;
      next();
    } catch {
      throw new ErrorHandler(401, 'Token Invalido');
    }
  } catch (error) {
    next(error);
  }
};
