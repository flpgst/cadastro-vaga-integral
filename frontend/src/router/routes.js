import isPrazoEncerrado from "@/utils/isPrazoEncerrado";

import NovoCadastro from "@/pages/Cadastro/Novo";

const ListaCadastros = () =>
  import(/* webpackChunkName: "lista-cadastros" */ "@/pages/Cadastro/Lista");

const ImprimirProtocolo = () =>
  import(
    /* webpackChunkName: "imprimir-protocolo" */ "@/pages/Protocolo/Imprimir"
  );

const BuscarProtocolo = () =>
  import(/* webpackChunkName: "buscar-protocolo" */ "@/pages/Protocolo/Buscar");

const PrazoEncerrado = () =>
  import(
    /* webpackChunkName: "buscar-protocolo" */ "@/pages/Cadastro/PrazoEncerrado"
  );

const routes = [
  {
    path: "/",
    name: "Novo Cadastro",
    component: NovoCadastro,
    beforeEnter: (to, from, next) => {
      isPrazoEncerrado() ? next({ path: "/encerrado", replace: true }) : next();
    }
  },
  {
    path: "/encerrado",
    name: "Prazo Encerrado",
    component: PrazoEncerrado,
    beforeEnter: (to, from, next) => {
      isPrazoEncerrado() ? next() : next("/");
    }
  },
  {
    path: "/cadastros",
    name: "Cadastros",
    component: ListaCadastros
  },
  {
    path: "/protocolo",
    name: "Imprimir Protocolo",
    component: BuscarProtocolo
  },
  {
    path: "/protocolo/:id",
    name: "Impressão de Protocolo",
    props: true,
    component: ImprimirProtocolo
  }
];

export default routes;
