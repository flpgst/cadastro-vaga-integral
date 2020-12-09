import NovoCadastro from "@/pages/Cadastro/Novo";

const ListaCadastros = () =>
  import(/* webpackChunkName: "lista-cadastros" */ "@/pages/Cadastro/Lista");

const ImprimirProtocolo = () =>
  import(
    /* webpackChunkName: "imprimir-protocolo" */ "@/pages/Protocolo/Imprimir"
  );

const BuscarProtocolo = () =>
  import(/* webpackChunkName: "buscar-protocolo" */ "@/pages/Protocolo/Buscar");

const routes = [
  {
    path: "/",
    name: "Novo Cadastro",
    component: NovoCadastro
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
