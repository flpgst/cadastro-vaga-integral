import express from 'express';
import cors from 'cors';
import Youch from 'youch';
import routes from './routes';
import './database';
import 'express-async-errors';
import { handleError } from './app/util/error';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
    // eslint-disable-next-line no-unused-vars
    this.server.use((err, req, res, next) => {
      handleError(err, res);
    });
  }

  middlewares() {
    this.server.disable('x-powered-by');
    this.server.use(express.json());
    this.server.use(cors());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
