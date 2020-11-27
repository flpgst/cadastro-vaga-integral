import { Router } from 'express';
import AuthMiddleware from './app/middlewares/auth';
import PermissionMiddleware from './app/middlewares/permission';
import SessionController from './app/controllers/SessionController';
import PessoaController from './app/controllers/PessoaController';
import InscricaoController from './app/controllers/InscricaoController';
import MatriculaController from './app/controllers/MatriculaController';
import ParentescoController from './app/controllers/ParentescoController';

const routes = new Router();

routes.post('/login', SessionController.store);
routes.use(AuthMiddleware);
routes.use(PermissionMiddleware);
routes.get('/pessoa/:id', PessoaController.index);
routes.post('/inscricao', InscricaoController.store);
routes.get('/matricula', MatriculaController.index);
routes.get('/parentesco', ParentescoController.index);

export default routes;
