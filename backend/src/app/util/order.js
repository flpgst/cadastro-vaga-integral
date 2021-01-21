function ordenaInscricoes(inscricoes) {
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

function alteraPosicao(inscricoes, inscricaoId, posicao) {
  const indexInscricao = inscricoes.indexOf(
    inscricoes.find((i) => i.id === Number(inscricaoId))
  );

  const indexPosicao = inscricoes.indexOf(
    inscricoes.find((i) => i.posicao === Number(posicao))
  );

  inscricoes = inscricoes.slice(
    Math.min(indexPosicao, indexInscricao),
    Math.max(indexPosicao, indexInscricao) + 1
  );

  // return inscricoes;
  let novaPosicao =
    inscricoes[0].id === Number(inscricaoId)
      ? inscricoes.shift()
      : inscricoes.pop();
  novaPosicao = { ...novaPosicao.dataValues, posicao };
  // return inscricoes;

  inscricoes = inscricoes.map(({ dataValues }) => ({
    ...dataValues,
    posicao: Number(dataValues.posicao) + 1,
  }));

  inscricoes.push(novaPosicao);
  return inscricoes;
}

export { ordenaInscricoes, alteraPosicao };
