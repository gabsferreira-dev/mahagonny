# Mahagonny · Programa Virtual

Programa virtual do espetáculo **Mahagonny**, adaptação de *Ascensão e Queda da Cidade de Mahagonny*, de Bertolt Brecht, com realização do **Grupo Teatral Gorki** (Ribeirão Preto/SP, 2026).

Ingressos: https://www.grupogorki.com.br/

## Estrutura

```
index.html   estrutura das seções: Início, Sinopse, Elenco, Produção, Ficha Técnica e Parceiros
styles.css   aparência do site
app.js       navegação, montagem de elenco e equipe, janela de currículos
data.js      elenco, equipe e currículos (edite aqui para atualizar textos)
img/         fotos, logos e favicon
404.html     página para endereços inexistentes, que volta ao programa
.nojekyll    faz o GitHub Pages servir os arquivos como estão
```

Cada seção tem um endereço próprio: `#sinopse`, `#elenco`, `#producao`, `#ficha`, `#parceiros`. Cada currículo também: `#cv-alexandre-guidorizzi`, `#cv-gabriel-ferreira` etc.

## Segurança e estabilidade

- **Política de Segurança de Conteúdo (CSP):** o navegador só executa scripts do próprio site e só carrega estilos, fontes e imagens de origens autorizadas (o próprio site e o Google Fonts).
- **Textos tratados como texto:** tudo o que vem de `data.js` é inserido como texto puro, nunca como código HTML.
- **Endereços validados:** âncoras desconhecidas ou malformadas levam de volta à página inicial.
- **Links externos isolados:** usam `rel="noopener noreferrer"`, e o site envia ao destino apenas o domínio de origem.
- **Tolerância a falhas:** se `data.js` não carregar, um aviso aparece e o resto do programa continua funcionando; uma foto ausente vira as iniciais da pessoa; uma pessoa citada sem cadastro é ignorada, sem quebrar a página.
- **Compatibilidade:** funciona em navegadores mais antigos, inclusive sem suporte nativo à janela de currículo.
- **Atualizações:** `index.html` chama os arquivos com um número de versão (`?v=AAAAMMDDHHMM`). Ao alterar `styles.css`, `app.js` ou `data.js`, troque esse número no `index.html` para que os visitantes recebam a versão nova, sem cache antigo.

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

