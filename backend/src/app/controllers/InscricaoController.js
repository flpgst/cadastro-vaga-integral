import Endereco from '../models/Endereco';
import Inscricao from '../models/Inscricao';
import MembroFamilia from '../models/MembroFamilia';
import { findInscricao, findMatriculaById } from '../util/finders';
import { cpf } from 'cpf-cnpj-validator';

class InscricaoController {
  async store(req, res) {
    if (!req.authorized)
      return res.status(401).json({ message: 'Não Autorizado' });

    const inscricao = req.body;
    const matricula = await findMatriculaById(inscricao.matricula_id);

    const {
      logradouro,
      numero,
      complemento,
      bairro,
      cep,
      cidade_id,
      id,
    } = matricula.dataValues.pessoa.dataValues.endereco.dataValues;

    const endereco = [
      logradouro,
      numero,
      complemento,
      bairro,
      cep,
      id,
      cidade_id,
    ];

    if (endereco.find((campo) => campo !== inscricao.endereco[campo])) {
      console.log('endereco :>> ', logradouro);
      await Endereco.update(
        {
          logradouro: inscricao.endereco.logradouro,
          numero: inscricao.endereco.numero,
          complemento: inscricao.endereco.complemento,
          bairro: inscricao.endereco.bairro,
          cep: inscricao.endereco.cep,
          cidade_id: inscricao.endereco.cep,
        },
        {
          where: {
            id,
          },
        }
      );
    }

    if (
      !req.superAdmin &&
      req.unidadeEnsinoId !== matricula.dataValues.unidade_ensino_id
    )
      return res.status(401).json({
        message: 'Você não tem permissão para cadastrar esta matrícula',
      });

    if (await findInscricao(inscricao.matricula_id))
      return res
        .status(400)
        .json({ message: 'Já existe uma inscrição para esta matrícula' });

    const invalidCPF = inscricao.membros.find(
      (membro) => membro.cpf && !cpf.isValid(membro.cpf)
    );

    const invalidCertidaoNascimento = inscricao.membros.find(
      (membro) =>
        membro.certidao_nascimento &&
        String(membro.certidao_nascimento).length !== 32
    );

    if (invalidCPF) return res.status(400).json({ message: 'CPF Inválido' });
    if (invalidCertidaoNascimento)
      return res
        .status(400)
        .json({ message: 'Certidão de Nascimento inválida' });

    try {
      const renda_percapta = (
        inscricao.membros.reduce(
          (renda, membro) => (renda += membro.renda || 0),
          0
        ) /
        (inscricao.membros.length + 1)
      ).toFixed(2);

      let inscricaoCreated = await Inscricao.create({
        ...inscricao,
        renda_percapta,
        pessoa_criacao: req.pessoaId,
      });

      inscricaoCreated.dataValues.membroFamilia = [];

      for await (let membro of inscricao.membros) {
        let endereco;
        if (membro.endereco)
          endereco = await Endereco.create({
            ...membro.endereco,
          });
        const membroFamilia = await MembroFamilia.create({
          ...membro,
          inscricao_id: inscricaoCreated.dataValues.id,
          endereco_id:
            endereco?.id ||
            matricula.dataValues.pessoa.dataValues.endereco.dataValues.id,
        });

        inscricaoCreated.dataValues.membroFamilia.push(
          membroFamilia.dataValues
        );
      }

      return res.status(200).json(inscricaoCreated);
    } catch (error) {
      return res.status(error.status).json({ message: error });
    }
  }

  async index(req, res) {
    if (!req.authorized)
      return res.status(401).json({ message: 'Não Autorizado' });

    const inscricoes = await Inscricao.findAll({
      include: {
        all: true,
        nested: true,
      },
    });

    return res.json(inscricoes);
  }

  async update(req, res) {
    if (!req.gestor && !req.superAdmin)
      return res.status(401).json({ message: 'Não Autorizado' });

    const { deferido, posicao } = req.body;
    const { id } = req.params;

    try {
      const inscricao = await Inscricao.findByPk(id);
      inscricao.deferido = deferido ?? inscricao.deferido;
      inscricao.posicao = posicao ?? inscricao.posicao;
      await inscricao.save();
      return res.json(inscricao);
    } catch (error) {
      return res.status(error.status).json({ message: error });
    }
  }

  async getById(req, res) {
    if (!req.authorized) {
      return res.status(401).json({ message: 'Não Autorizado' });
    }

    const { id } = req.params;

    const inscricao = await Inscricao.findByPk(id, {
      include: { nested: true, all: true },
    });

    return res.json(inscricao);
  }
}
export default new InscricaoController();
