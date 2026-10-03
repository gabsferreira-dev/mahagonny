# Mahagonny · Programa Virtual

Programa virtual do espetáculo **Mahagonny**, adaptação de *Ascensão e Queda da Cidade de Mahagonny*, de Bertolt Brecht, com realização do **Grupo Teatral Gorki** (Ribeirão Preto/SP, 2026).

Ingressos: https://www.grupogorki.com.br/

## Estrutura

```
index.html   página única com as seções Início, Sinopse, Elenco, Produção, Ficha Técnica e Parceiros
data.js      elenco, equipe e currículos (edite aqui para atualizar textos)
img/         fotos, logos e favicon
.nojekyll    faz o GitHub Pages servir os arquivos como estão
```

Cada seção tem um endereço próprio: `#sinopse`, `#elenco`, `#producao`, `#ficha`, `#parceiros`. Cada currículo também: `#cv-alexandre-guidorizzi`, `#cv-gabriel-ferreira` etc.

## Publicar no GitHub Pages

1. Crie um repositório (por exemplo, `mahagonny`) e envie todos os arquivos desta pasta para a raiz.
2. No repositório, abra **Settings > Pages**.
3. Em **Source**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`, e salve.
4. Em um ou dois minutos o site estará em `https://SEU-USUARIO.github.io/mahagonny/`.

## Atualizar conteúdo

- **Currículos:** em `data.js`, objeto `PEOPLE`. Cada pessoa tem `nome`, `resumo` (opcional) e `longo` (lista de parágrafos, opcional). Sem nenhum dos dois, aparece "Currículo em breve".
- **Elenco:** em `data.js`, lista `CAST` (personagem, apelido, pessoa, imagem e fala).
- **Equipe:** em `data.js`, lista `CREW`. Para incluir uma foto, coloque `img/nome.jpg` e preencha `img: "nome"`; com `img: null` aparecem as iniciais.
- **Fotos:** use JPG em retrato 4:5, com cerca de 800 x 1000 px.

## Créditos

- Fotografia de Carlos Arantes.
- Design gráfico do espetáculo: Lívia Azevedo.
- Fotografia: Danilo César.

