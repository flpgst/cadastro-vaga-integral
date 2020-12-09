export default class Inscricao {
  constructor(
    matricula_id,
    endereco,
    membros,
    transporte_proprio,
    vulnerabilidade_social,
    processo_judicial
  ) {
    this.matricula_id = matricula_id;
    this.endereco = endereco
      ? {
          ...endereco,
          logradouro: endereco.rua,
          cidade_id: endereco.cidade.id,
          cep: endereco.cep.replace("-", "")
        }
      : null;

    this.membros = membros.map(
      ({
        nome,
        cpf,
        certidaoNascimento: certidao_nascimento,
        pisPasep,
        workplace,
        income: renda,
        kinship,
        endereco
      }) => ({
        nome,
        cpf: cpf ? cpf.replace(/\./gi, "").replace("-", "") : null,
        certidao_nascimento,
        pisPasep,
        local_trabalho: workplace.name,
        horario_trabalho_inicio: workplace.start,
        horario_trabalho_fim: workplace.end,
        telefone_trabalho: workplace.phone,
        renda,
        parentesco_id: kinship.id,
        endereco: endereco
          ? {
              ...endereco,
              logradouro: endereco.rua,
              cidade_id: endereco.cidade.id,
              cep: endereco.cep.replace("-", "")
            }
          : null
      })
    );
    this.transporte_proprio = transporte_proprio;
    this.vulnerabilidade_social = vulnerabilidade_social;
    this.processo_judicial = processo_judicial;
  }
}
