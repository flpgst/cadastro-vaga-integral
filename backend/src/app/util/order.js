export default function ordenaInscricoes(inscricoes) {
  inscricoes = inscricoes.map((inscricao) => ({
    ...inscricao,
    processo_judicial: !!inscricao.processo_judicial,
  }));

  const parametros = [
    'processo_judicial',
    'vulnerabilidade_social',
    'renda_percapta',
  ];

  const ordena = (inscricoes, parametro, desempate = 'id') =>
    inscricoes.sort(
      (a, b) => a[parametro] - b[parametro] || a[desempate] - b[desempate]
    );

  const inscricoesPorParametro = inscricoes.reduce(
    (inscricoes, inscricao) => {
      inscricoes[
        inscricao.processo_judicial
          ? 0
          : inscricao.vulnerabilidade_social
          ? 1
          : 2
      ].push(inscricao);
      return inscricoes;
    },
    [[], [], []]
  );

  inscricoes = [];
  inscricoesPorParametro.forEach((i, index) => {
    inscricoes.push(
      ...ordena(
        i,
        parametros[index],
        parametros[index] === 'vulnerabilidade_social' ? 'renda_percapta' : 'id'
      )
    );
  });

  return inscricoes;
}
