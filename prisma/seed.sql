-- Script para popular o banco de dados com dados iniciais
-- Execute este script após rodar as migrações do Prisma

-- Inserir categorias
INSERT INTO "Categoria" ("nomeCategoria", "descricao", "createdAt", "updatedAt") VALUES
('Agrovia Conversa', 'Entrevistas e diálogos com especialistas do agronegócio', NOW(), NOW()),
('Agrovia Inspira', 'Depoimentos e histórias inspiradoras de produtores rurais', NOW(), NOW())
ON CONFLICT ("nomeCategoria") DO NOTHING;

-- Inserir vídeos para Agrovia Conversa
INSERT INTO "Video" (
  "nomeVideo", 
  "descricao", 
  "urlArquivo", 
  "imagemThumb", 
  "nomeAutor", 
  "cargoAutor", 
  "ativo", 
  "ordem", 
  "dataUpload", 
  "updatedAt", 
  "categoriaId"
) VALUES
(
  'Eng. Florestal Carlos Prado fala sobre reflorestamento e mercado de carbono',
  'Entrevista com o engenheiro florestal Carlos Prado sobre as oportunidades do mercado de carbono no Brasil e as práticas de reflorestamento mais eficazes para produtores rurais.',
  '/videos/agrovia-conversa-1.mp4',
  '/images/agrovia-conversa1.jpg',
  'Carlos Prado',
  'Eng. Florestal',
  true,
  1,
  NOW(),
  NOW(),
  (SELECT "idCategoria" FROM "Categoria" WHERE "nomeCategoria" = 'Agrovia Conversa')
),
(
  'Profa. Marina Souza comenta práticas de ILPF no Centro-Oeste',
  'Conteúdo introdutório sobre Integração Lavoura-Pecuária-Floresta, desafios e ganhos de produtividade no médio prazo com a pesquisadora Marina Souza.',
  '/videos/agrovia-conversa-2.mp4',
  '/images/agrovia-conversa2.jpg',
  'Marina Souza',
  'Pesquisadora',
  true,
  2,
  NOW(),
  NOW(),
  (SELECT "idCategoria" FROM "Categoria" WHERE "nomeCategoria" = 'Agrovia Conversa')
);

-- Inserir vídeos para Agrovia Inspira
INSERT INTO "Video" (
  "nomeVideo", 
  "descricao", 
  "urlArquivo", 
  "imagemThumb", 
  "nomeAutor", 
  "cargoAutor", 
  "ativo", 
  "ordem", 
  "dataUpload", 
  "updatedAt", 
  "categoriaId"
) VALUES
(
  'Seu João e os filhos - 40 anos de produção familiar em Goiás',
  'História inspiradora de uma família que mantém a tradição agrícola há quatro décadas, mostrando a importância da agricultura familiar no Brasil.',
  '/videos/agrovia-inspira1.mp4',
  '/images/agrovia-inspira1.jpg',
  'Jorge Santos',
  'Produtor Rural',
  true,
  1,
  NOW(),
  NOW(),
  (SELECT "idCategoria" FROM "Categoria" WHERE "nomeCategoria" = 'Agrovia Inspira')
),
(
  'Dona Maria e a cooperativa - Histórias de superação e agricultura sustentável',
  'Depoimento emocionante sobre como as cooperativas agrícolas transformam vidas e promovem práticas sustentáveis no campo.',
  '/videos/agrovia-inspira2.mp4',
  '/images/agrovia-inspira2.jpg',
  'Maria Oliveira',
  'Cooperativa',
  true,
  2,
  NOW(),
  NOW(),
  (SELECT "idCategoria" FROM "Categoria" WHERE "nomeCategoria" = 'Agrovia Inspira')
);
