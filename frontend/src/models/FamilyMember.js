import Address from "@/models/Address";

export default class FamilyMember {
  constructor() {
    this.nome = null;
    this.kinship = {};
    this.income = null;
    this.cpf = null;
    this.certidaoNascimento = null;
    this.pisPasep = null;

    this.workplace = {
      name: null,
      phone: null,
      start: null,
      end: null
    };

    this.endereco = new Address();
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
