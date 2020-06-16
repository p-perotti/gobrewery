module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert(
      'products',
      [
        {
          name: 'Baltic Porter',
          description:
            'Feita a partir de uma base de malte Pale Ale combinado com maltes Vienna, Munich, Special B, Caraamber e malte chocolate, todos provenientes das melhores malterias da Europa.',
          active: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Pilsen',
          description:
            'O tradicional estilo alemão de cerveja mais popular no Brasil! É uma cerveja dourada, translúcida, leve e com uma espuma cremosa. Possui um equilíbrio entre o malte e os lúpulos.',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Vienna Lager',
          description:
            'Uma cerveja de estilo clássico de cor levemente acobreada, possui sabor de malte, rico em notas de pão e levemente tostado, além de ter uma elegante complexidade de malte no início, com uma presença de amargor de lúpulo.',
          active: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Witbier Sinensis',
          description:
            'Estilo clássico de cerveja belga feita com a utilização de raspas de laranja e Coentro. Fermentado com cepas de leveduras belgas que remetem a sabores picantes e especiarias.',
          active: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'East Coast IPA',
          description:
            'Traz um amargor suave pelo uso do lúpulo Sincoe, que combinado com lúpulos cítricos americanos, tornam esta cerveja refrescante e deliciosa do início ao fim.',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Double IPA',
          description:
            'Forte, intensamente lupulada, mas limpa, seca e sem aspereza.',
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'American Wheat',
          description:
            'De trigo leve ao estilo americano de cervejas fermentada com leveduras americanas.',
          active: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
