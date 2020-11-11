# Set node version
FROM node:12.16.2

# Copy the source
WORKDIR /src
COPY ./ /src

LABEL maintainer="Lobo Metalúrgico <contato@lobometalurgico.tk>"

# Update the language submodule
RUN if [ -z "$(ls -A /src/languages)" ]; then git submodule update --init; fi

# Install Packages
RUN npm install

# Start bot
CMD ["npm", "start"]