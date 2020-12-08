export default class Address {
  constructor() {
    this.rua = null;
    this.cep = null;
    this.numero = null;
    this.bairro = null;
    this.cidade = {};
    this.complemento = null;
  }

  isEmpty(obj = this) {
    for (const attr in obj) {
      if (!obj[attr]) continue;

      if (!(typeof obj[attr] === "object") || !obj.isEmpty(obj[attr]))
        return false;
    }

    return true;
  }

  clear() {
    this.constructor();
  }
}
