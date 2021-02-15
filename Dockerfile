FROM node:12.16.2
LABEL maintainer="Lobo Metalúrgico <contato@lobometalurgico.tk>"
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
RUN git clone https://github.com/ArunaBot/ArunaLanguages.git languages
CMD ["npm", "start"]
