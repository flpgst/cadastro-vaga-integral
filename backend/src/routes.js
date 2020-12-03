import { Router } from 'express';
import AuthMiddleware from './app/middlewares/auth';
import PermissionMiddleware from './app/middlewares/permission';
import SessionController from './app/controllers/SessionController';
import PessoaController from './app/controllers/PessoaController';
import InscricaoController from './app/controllers/InscricaoController';
import MatriculaController from './app/controllers/MatriculaController';
import ParentescoController from './app/controllers/ParentescoController';
import CidadeController from './app/controllers/CidadeController';
import EstadoController from './app/controllers/EstadoController';

const routes = new Router();

routes.post('/login', SessionController.store);
routes.use(AuthMiddleware);
routes.use(PermissionMiddleware);
routes.get('/pessoa/:id', PessoaController.index);
routes.post('/inscricao', InscricaoController.store);
routes.get('/inscricao', InscricaoController.index);
routes.put('/inscricao/:id', InscricaoController.update);
routes.get('/matricula/', MatriculaController.index);
routes.get('/parentesco', ParentescoController.index);
routes.get('/cidade', CidadeController.index);
routes.get('/estado', EstadoController.index);

export default routes;
