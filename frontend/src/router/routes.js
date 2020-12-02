import Home from "@/pages/Home";
const ListaCadastros = () =>
  import(/* webpackChunkName: "lista-cadastros" */ "@/pages/Cadastro/Lista");
const NovoCadastro = () =>
  import(/* webpackChunkName: "novo-cadastro" */ "@/pages/Cadastro/Novo");

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/cadastros",
    name: "Cadastros",
    component: ListaCadastros
  },
  {
    path: "/cadastros/novo",
    name: "Novo Cadastro",
    component: NovoCadastro
  }
];

export default routes;
