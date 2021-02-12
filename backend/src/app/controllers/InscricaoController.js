import Cidade from '../models/Cidade';
import Endereco from '../models/Endereco';
import ErrorHandler from '../util/error';
import Inscricao from '../models/Inscricao';
import Matricula from '../models/Matricula';
import MembroFamilia from '../models/MembroFamilia';
import Parentesco from '../models/Parentesco';
import Pessoa from '../models/Pessoa';
import ProcessoInscricao from '../models/ProcessoInscricao';
import UnidadeEnsino from '../models/UnidadeEnsino';
import UnidadeEnsinoTipo from '../models/UnidadeEnsinoTipo';
import { cpf } from 'cpf-cnpj-validator';
import { findMatriculaById } from '../util/finders';

class InscricaoController {
  async store(req, res, next) {
    try {
      const inscricao = req.body;
      const matricula = await findMatriculaById(inscricao.matricula_id);

      if (!req.superAdmin) throw new ErrorHandler(401, 'Não autorizado');

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
        await Endereco.update(
          {
            logradouro: inscricao.endereco.logradouro,
            numero: inscricao.endereco.numero,
            complemento: inscricao.endereco.complemento,
            bairro: inscricao.endereco.bairro,
            cep: inscricao.endereco.cep,
            cidade_id: inscricao.endereco.cidade_id,
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
        req.unidadeEnsinoId !== matricula.dataValues.unidadeEnsinoId
      )
        throw new ErrorHandler(
          401,
          'Você não tem permissão para cadastrar esta matrícula'
        );

      const hasInscricao = await Inscricao.findOne({
        where: {
          matricula_id: inscricao.matricula_id,
          ativo: true,
        },
      });
      console.log('hasInscricao :>> ', hasInscricao);
      if (hasInscricao)
        throw new ErrorHandler(
          401,
          'Já existe uma inscrição para esta matrícula'
        );

      const invalidCPF = inscricao.membros.find(
        (membro) => membro.cpf && !cpf.isValid(membro.cpf)
      );
      const invalidCertidaoNascimento = inscricao.membros.find(
        (membro) =>
          membro.certidao_nascimento &&
          String(membro.certidao_nascimento).length !== 32
      );

      if (invalidCPF) throw new ErrorHandler(401, 'CPF inválido');

      if (invalidCertidaoNascimento)
        throw new ErrorHandler(401, 'Certidão de nascimento inválida');

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
        throw new ErrorHandler(500, error.message);
      }
    } catch (error) {
      next(error);
    }
  }

  async index(req, res, next) {
    try {
      if (!req.superAdmin && !req.gestor)
        throw new ErrorHandler(401, 'Não autorizado');

      const inscricoes = await Inscricao.findAll({
        where: { ativo: true },
        include: {
          all: true,
          nested: true,
        },
        order: [['posicao', 'ASC']],
      });

      return res.status(200).json(inscricoes);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { status } = req.body;
      const { id } = req.params;

      if (!req.superAdmin && !req.gestor)
        throw new ErrorHandler(401, 'Não autorizado');

      try {
        const inscricao = await Inscricao.findOne({
          where: { id, ativo: true },
        });
        if (!inscricao) {
          return res.status(404).json({ message: 'Inscricão não encontrada' });
        }
        inscricao.status = status;

        console.log('inscricao :>> ', inscricao);

        await inscricao.save();

        // return res.json(inscricao);

        const inscricoes = await Inscricao.findAll({
          where: {
            ativo: true,
          },
          include: [
            ProcessoInscricao,
            {
              model: MembroFamilia,
              include: [
                {
                  model: Endereco,
                  include: { model: Cidade, nested: true, all: true },
                },
                Parentesco,
              ],
            },
            {
              model: Matricula,
              include: [
                { model: Pessoa, nested: true, all: true },
                {
                  model: UnidadeEnsino,
                  include: [
                    {
                      model: Pessoa,
                      as: 'pessoa',
                    },
                    {
                      model: UnidadeEnsinoTipo,
                      as: 'unidadeEnsinoTipo',
                    },
                  ],
                },
              ],
            },
          ],
          order: ['posicao', 'id'],
        });
        return res.json(inscricoes);
      } catch (error) {
        throw new ErrorHandler(error.status, error.message);
      }
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      if (!req.superAdmin) throw new ErrorHandler(401, 'Não autorizado');

      const inscricao = await Inscricao.findByPk(id);
      inscricao.ativo = false;
      inscricao.pessoa_modificacao = req.pessoaId;

      await inscricao.save();

      return res.json({ message: 'Inscrição excluída' });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res) {
    const { id } = req.params;

    const inscricao = await Inscricao.findOne({
      where: { id, ativo: true },
      include: { nested: true, all: true },
    });

    return inscricao ? res.json(inscricao) : res.end();
  }
}
export default new InscricaoController();
