export default class Student {
  constructor({ id, pessoa, codigo }) {
    this.id = pessoa.id;
    this.codigo = codigo;
    this.nome = pessoa.nome;
    this.matricula = {
      id,
      codigo
    };
    this.endereco = {
      ...pessoa.endereco,
      rua: pessoa.endereco.logradouro
    };
  }
}
