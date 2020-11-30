import Address from "@/models/Address";

export default class FamilyMember {
  constructor() {
    this.nome = null;
    this.kinship = null;
    this.income = null;

    this.workplace = {
      name: null,
      phone: null,
      start: null,
      end: null
    };

    this.endereco = new Address();
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
}
