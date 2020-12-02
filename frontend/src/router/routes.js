import NovoCadastro from "@/pages/Cadastro/Novo";

const ListaCadastros = () =>
  import(/* webpackChunkName: "lista-cadastros" */ "@/pages/Cadastro/Lista");

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
  }
];

export default routes;
