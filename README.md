
<p align="center">
<a href="https://discord.gg/NqbBgEf"><img src="https://discordapp.com/api/guilds/660610178009530380/widget.json"></a>
</p>
<h1 align="center">Aruna</h1>
<p align="center">
<a href="https://top.gg/bot/593303574725787657" >
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
<a href="https://github.com/ArunaBot/Aruna/workflows/Node.js%20CI/badge.svg?branch=Unstable"><img src="https://github.com/ArunaBot/Aruna/workflows/Node.js%20CI/badge.svg?branch=Unstable"></a>
<a href="https://github.com/ArunaBot/Aruna/workflows/Node.js%20CI/badge.svg?branch=Stable"><img src="https://github.com/ArunaBot/Aruna/workflows/Node.js%20CI/badge.svg?branch=Stable"></a>
</p>
<p align="center">
<a href="https://github.com/ArunaBot/Aruna/stargazers"><img src="https://img.shields.io/github/stars/ArunaBot/Aruna.svg?style=social&label=Stars"></a>
<a href="https://github.com/ArunaBot/Aruna/watchers"><img src="https://img.shields.io/github/watchers/ArunaBot/Aruna.svg?style=social&label=Watch"></a>
</p>

Olá, eu me chamo Aruna. Sou um bot brasileiro para Discord com algumas funções muito interessantes.

Eu tenho várias funções para entretenimento (como comandos engraçados e memes), funções sociais (sistema de perfil com XP e reputação), extremamente customizável (você pode ativar/desativar qualquer comando meu, alterar meu prefixo para o que você quiser e muito mais!).

## Como eu adiciono-a ao meu servidor?

Se você quiser usar a Aruna no seu servidor, você pode adiciona-la clicando [aqui](https://discordapp.com/oauth2/authorize?client_id=593303574725787657&scope=bot&permissions=2146954751).

## Suporte

Você pode obter suporte sobre a Aruna [clicando aqui](https://discord.gg/NqbBgEf)!

## Como ajudar?

No momento, existe apenas 1 repositório [na nossa organização](https://github.com/ArunaBot); Este é,
* [Aruna](https://github.com/ArunaBot/Aruna): Código-fonte da Aruna ("backend"), isto inclui todo o bot em si.

### 💵 Como Doar?

Mesmo que você não saiba programar, você pode ajudar no desenvolvimento doando! https://patreon.com/LoboMetalurgico (outras formas de doação estarão desponíveis em breve).

### Como Usar?
#### Como Selfhostear?

Você também pode hospedar a Aruna você mesmo (afinal, é por isso que se chama *self*hosting) caso você preferia ter total controle sobre os bots que você tem no seu servidor, mas lembre-se...
* Nós deixamos o código-fonte para que outras pessoas possam se inspirar e aprender com nossos projetos, o objetivo é que pessoas que são fãs da Aruna aprendam como ela funciona e, caso queiram, podem ajudar ela com correções e/ou novas funcionalidades.
* Eu não irei dar suporte caso você queria fazer self hosting apenas para querer "fama" falando que você criou um bot, mesmo que na verdade você apenas pegou o código-fonte dela e hospedou, lembre-se, a licença do projeto é [AGPL v3](https://github.com/ArunaBot/Aruna/blob/stable/LICENSE), você é **obrigado a deixar todas as suas alterações no projeto públicas**!
* Eu não irei ficar explicando e te ajudando a como arrumar problemas na sua versão selfhosted, portanto **você está por sua conta e risco**. A única exceção é se você está planejando selfhostear para ajudar a desenvolve-la.
* Para evitar confusões e problemas, você **não pode** utilizar o nome ou a personagem "Aruna" ou nomes parecidos na sua versão selfhosted.

Nós [recomendamos utilizar a versão pública da Aruna](https://discordapp.com/oauth2/authorize?client_id=593303574725787657&scope=bot&permissions=2146954751), mas se você *realmente* quiser hospedar ou ajudar a desenvolver a Aruna, siga os seguintes passos:
1. Tenha o [NODE 12.16.2 (ou superior)](https://nodejs.org/en/) instalado na sua máquina e certifique-se que o node e o npm (incluso no node) está acessível pelo terminal. (Tente executar `node` e `npm` no terminal, caso não funcione, procure reinstalar o node ou reiniciar a máquina).
2. Tenha o MongoDB instalado na sua máquina. (Ou se prefereir, pode usar o [MongoDB Online](https://mongodb.com/)).
3. Tenha o `git-shell` ou o `git-cli` instalados. No Windows você pode utilizar o `Git Bash`.
4. Caso você precise ou fazer modificações no código-fonte, é recomendado utilizar o [Visual Studio Code](https://code.visualstudio.com/).
5. Faça `git clone https://github.com/ArunaBot/Aruna.git` em alguma pasta no seu computador.
6. Agora, usando o processador de comandos do seu sistema operacional (CMD, POWERSHELL, Terminal, etc), entre na pasta criada e utilize `npm install`.
8. Ao terminar de fazer o download de tudo, verifique se foi criado a pasta `node modules`.
9. Caso essa pasta exista e tenha sido criado o arquivo `package-lock.json` significa que tudo deu certo!
10. Agora, retire o `_` da pasta `_configs` e do aquivo `_.env`.
11. Depois, abra o arquivo .env e preencha o `TOKEN_ARUNA` com o token do seu bot, e o `MONGOOSE` com seu diretório do moongose criado no mongodb.com. (Caso tenha hospedado o mongo em sua máquina, altere o arquivo presente na configs/mongoose.js com as configurações adequadas no campo de url e login (verifique a documentação do mongoose para isso)).
11. Com tudo pronto, podemos iniciá-la abrindo um terminal e digitando `npm start`.
12. Caso tenha dado tudo certo, a sua versão selfhosted irá iniciar e você poderá utilizar os comandos dela! 🎉

Para editar o código-fonte da Aruna, faça os tópicos de de 1 a 9 e depois, abra a pasta com o código em seu visual studio code e divirta-se aprendendo, modificando e melhorando a Aruna!

#### Pull Requests

No seu Pull Request, você deverá seguir o meu estilo de código bonitinho que eu faço, é recomendado que você coloque comentários nas partes do seu código para que seja mais fácil na hora da leitura.

O seu código não pode ser algo "gambiarra", meu código pode ter gambiarras mas isto não significa que você também deve encher a Aruna com mais gambiarras.

Você precisa pensar "será que alguém iria utilizar isto?", se você criar um comando que só seja útil no seu servidor, provavelmente eu irei negar o seu Pull Request.

Funcionalidades (como comandos) relacionados a coisas NSFW **não serão** adicionadas na Aruna e seu Pull Request será negado, eu prefiro que as pessoas pensem que ela é um bot que faz memes, ao invés de um bot que fica mandando coisas NSFW no chat.

## Dependências

A Aruna utiliza várias [dependências no código-fonte dela](https://github.com/ArunaBot/Aruna/blob/stable/package.json), obrigado a todos os mantenedores das dependências! Sem vocês, a Aruna não iria existir (ou teria várias funcionalidades reduzidas ou talvez até inexistentes!).

| Nome  | Mantenedor |
| ------------- | ------------- |
| [Node](https://nodejs.org/en/) | OpenJS Foundation  |
| [discord.js](https://discord.js.org/) | Comunnity  |
| [Express](https://github.com/expressjs/express) | TJ Holowaychuk, Douglas Christopher Wilson  |
| [Express Session](https://github.com/expressjs/session) |  dougwilson, Fishrock123, etc |
| [Mongoose](http://mongoosejs.com/) |  vkarpov15, aheckmann, rauchg, etc  |
| [Moment](http://momentjs.com) |  ichernev, timrwood, icambron, etc  |
| [Moment Duration Format](https://github.com/jsmreese/moment-duration-format) |  jsmreese  |
| [Dotenv](https://github.com/motdotla/dotenv) |  motdotla, maxbeatty, etc  |
| [Ytdl Core](https://github.com/fent/node-ytdl-core) |  fent, #3TimeForANinja, etc  |
| [Node Opus](github.com/Rantanen/node-opus) |  Rantanen, thijstriemstra, nfriedly, etc  |
| [Jimp](github.com/oliver-moran/jimp) |  hipstersmoothie, oliver-moran, strandedcity, etc  |
| [SuperAgent](github.com/visionmedia/superagent) |  tj, kornelski, defunctzombie, etc  |
| [MathJS](https://mathjs.org/) |  josdejong, rjbaucells, FSMaxB  |
| [Chalk](github.com/chalk/chalk) |  sindresorhus, Qix-, etc  |

## 📄 Licença

O código-fonte da Aruna está licenciado sob a [GNU Affero General Public License v3.0](https://github.com/ArunaBot/Aruna/blob/stable/LICENSE)

<hr>
<br>
<p align="center">"Discord", "DiscordApp" and any associated logos are registered trademarks of Discord Inc.</p>
