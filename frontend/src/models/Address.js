export default class Address {
  constructor() {
    this.rua = null;
    this.numero = null;
    this.bairro = null;
    this.cidade = null;
    this.complemento = null;
  }

  isEmpty() {
    for (const attr in this) if (this[attr]) return false;

    return true;
  }

  clear() {
    for (const attr in this) this[attr] = null;
  }
}
