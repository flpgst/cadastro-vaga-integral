import NovoCadastro from "@/pages/Cadastro/Novo";

const ListaCadastros = () =>
  import(/* webpackChunkName: "lista-cadastros" */ "@/pages/Cadastro/Lista");

const ProtocolPrint = () =>
  import(/* webpackChunkName: "impressao-protocolo" */ "@/pages/ProtocolPrint");

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
    path: "/protocolo/:id",
    name: "Impressão de Protocolo",
    props: true,
    component: ProtocolPrint
  }
];

export default routes;
