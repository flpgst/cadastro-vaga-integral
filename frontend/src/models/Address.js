export default class Address {
  constructor() {
    this.rua = null;
    this.numero = null;
    this.bairro = null;
    this.cidade = {};
    this.complemento = null;
  }

  isAttrEmpty(attr) {
    for (const key in attr) {
      if (!attr[key]) continue;

      if (!(typeof attr[key] === "object") || !this.isAttrEmpty(attr[key]))
        return false;
    }

    return true;
  }

  isEmpty() {
    for (const attr in this) {
      if (!this[attr]) continue;

      if (!(typeof this[attr] === "object") && !this.isAttrEmpty(this[attr]))
        return false;
    }

    return true;
  }

  clear() {
    for (const attr in this) this[attr] = attr === "cidade" ? {} : null;
  }
}
