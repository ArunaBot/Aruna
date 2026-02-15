
<p align="center">
<a href="https://discord.gg/NqbBgEf" target="_blank"><img src="https://discordapp.com/api/guilds/660610178009530380/widget.png"></a>
</p>
<h1 align="center">Aruna</h1>
<p align="center">
<a href="https://top.gg/bot/593303574725787657" target="_blank" >
  <img src="https://top.gg/api/widget/593303574725787657.svg" alt="Aruna" />
</a>
 </p>
<p align="center">
<a href="https://github.com/ArunaBot/Aruna/blob/stable/LICENSE"><img src="https://img.shields.io/badge/license-AGPL%20v3-lightgray.svg"></a>
</p>
<p align="center">
<a href="README_EN.md"><img src="https://img.shields.io/badge/🌐_Readme_📖-Read_In_English-03ebfc.svg"></a>
<a href="README.md"><img src="https://img.shields.io/badge/🌐_Readme_📖-Leia_em_Português-03fc41.svg"></a>
</p>
<p align="center">
<a href="https://github.com/ArunaBot/Aruna/tree/Stable"><img src="https://github.com/ArunaBot/Aruna/workflows/Node.js%20CI/badge.svg?branch=Stable"></a>
<a href="https://github.com/ArunaBot/Aruna/tree/Unstable"><img src="https://github.com/ArunaBot/Aruna/workflows/Node.js%20CI/badge.svg?branch=Unstable"></a>
</p>
<p align="center">
<a href="https://github.com/ArunaBot/Aruna/stargazers"><img src="https://img.shields.io/github/stars/ArunaBot/Aruna.svg?style=social&label=Stars"></a>
<a href="https://github.com/ArunaBot/Aruna/watchers"><img src="https://img.shields.io/github/watchers/ArunaBot/Aruna.svg?style=social&label=Watch"></a>
</p>

Olá, eu me chamo Aruna. Sou um bot brasileiro para Discord com algumas funções muito interessantes.

Eu tenho várias funções para entretenimento (como comandos engraçados), funções sociais, extremamente customizável (você pode ativar/desativar diversos comandos meu, alterar meu prefixo para o que você quiser e muito mais!).

## Como eu adiciono-a ao meu servidor?

Se você quiser usar a Aruna no seu servidor, você pode adiciona-la clicando [aqui](https://discordapp.com/oauth2/authorize?client_id=593303574725787657&scope=bot&permissions=2146954751).

## Suporte

Você pode obter suporte sobre a Aruna [clicando aqui](https://discord.gg/NqbBgEf)!

## Como ajudar?

No momento, temos 2 repositórios [na nossa organização](https://github.com/ArunaBot); Estes são,
* [Aruna](https://github.com/ArunaBot/Aruna): Código-fonte da Aruna ("backend"), isto inclui todo o bot em si.
* [ArunaLanguages](https://github.com/ArunaBot/ArunaLanguages): Os idiomas da aruna, toda e qualquer tradução vem de lá.

### 💵 Como Doar?

Mesmo que você não saiba programar, você pode ajudar no desenvolvimento doando! https://patreon.com/LoboMetalurgico (outras formas de doação estarão disponíveis em breve).

### Como Usar?
#### Como Selfhostear?

Você também pode hospedar a Aruna você mesmo (afinal, é por isso que se chama *self*hosting) caso você preferia ter total controle sobre os bots que você tem no seu servidor, mas lembre-se...
* Nós deixamos o código-fonte para que outras pessoas possam se inspirar e aprender com nossos projetos, o objetivo é que pessoas que são fãs da Aruna aprendam como ela funciona e, caso queiram, podem ajudar ela com correções e/ou novas funcionalidades.
* Eu não irei dar suporte caso você queria fazer self hosting apenas para querer "fama" falando que você criou um bot, mesmo que na verdade você apenas pegou o código-fonte dela e hospedou, lembre-se, a licença do projeto é [AGPL v3](https://github.com/ArunaBot/Aruna/blob/stable/LICENSE), você é **obrigado a deixar todas as suas alterações no projeto públicas**!
* Eu não irei ficar explicando e te ajudando a como arrumar problemas na sua versão selfhosted, portanto **você está por sua conta e risco**. A única exceção é se você está planejando selfhostear para ajudar a desenvolve-la.
* Para evitar confusões e problemas, você **não pode** utilizar o nome ou a personagem "Aruna" ou nomes parecidos na sua versão selfhosted.

Nós [recomendamos utilizar a versão pública da Aruna](https://discordapp.com/oauth2/authorize?client_id=593303574725787657&scope=bot&permissions=2146954751), mas se você *realmente* quiser hospedar ou ajudar a desenvolver a Aruna, siga os seguintes passos:

1. Tenha o [NODE 22.12.0 (ou superior)](https://nodejs.org/en/) instalado na sua máquina e certifique-se que o node e o npm (incluso no nodejs) estão acessíveis pelo terminal. (Tente executar `node -v` e `npm -v` no terminal, caso não funcionem, procure reinstalar o nodejs ou reiniciar a máquina).
2. Tenha o MongoDB instalado na sua máquina. (Ou se prefereir, pode usar o [MongoDB Online](https://mongodb.com/)).
3. Tenha o `git-shell` ou o `git-cli` instalados. No Windows você pode utilizar o `Git Bash`.
4. Caso você precise ou fazer modificações no código-fonte, é recomendado utilizar o [Visual Studio Code](https://code.visualstudio.com/).
5. Execute o comando `git clone https://github.com/ArunaBot/Aruna.git` usando seu terminal git em uma pasta vazia do seu computador.
6. Acesse a pasta criada usando o processador de comandos do seu sistema operacional (CMD, POWERSHELL, Terminal, etc) e execute o comando `git submodule update --init` para baixar o pacote de idiomas da aruna.
7. Ainda com o processador de comandos, execute o comando `npm install`.
8. Ao terminar de fazer o download de tudo, verifique se foi criado a pasta `node_modules`.
9. Caso essa pasta exista e tenha sido criado o arquivo `package-lock.json` significa que tudo deu certo!
10. Agora, retire o `.` da pasta `.Configs`.
11. Depois, abra o arquivo `general` e preencha o campo `token` com o token do seu bot, o campo `mongoose` com o link de acesso ao mongoose e por fim, altere o campo `superUsersId` para o id do seu usuário.
11. Com tudo pronto, podemos iniciá-la abrindo um terminal e digitando `npm start`.
12. Caso tenha dado tudo certo, a sua versão selfhosted irá iniciar e você poderá utilizar os comandos dela! 🎉

Para editar o código-fonte da Aruna, faça os tópicos de de 1 a 9 e depois, abra a pasta com o código em seu visual studio code e divirta-se aprendendo, modificando e melhorando a Aruna!

#### Pull Requests

No seu Pull Request, você deverá seguir o meu estilo de código bonitinho que eu faço, é recomendado que você coloque comentários nas partes do seu código para que seja mais fácil na hora da leitura.

O seu código não pode ser algo "gambiarra", meu código pode ter gambiarras mas isto não significa que você também deve encher a Aruna com mais gambiarras.

Você precisa pensar "será que alguém iria utilizar isto?", se você criar um comando que só seja útil no seu servidor, provavelmente eu irei negar o seu Pull Request.

Funcionalidades (como comandos) relacionados a coisas NSFW **não serão** adicionadas na Aruna e seu Pull Request será negado.

## 📄 Licença

O código-fonte da Aruna está licenciado sob a [GNU Affero General Public License v3.0](https://github.com/ArunaBot/Aruna/blob/stable/LICENSE)

<hr>
<br>
<p align="center">"Discord", "DiscordApp" and any associated logos are registered trademarks of Discord Inc.</p>
