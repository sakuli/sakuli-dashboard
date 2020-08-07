FROM node:12-slim
WORKDIR /build/
COPY ./api ./api
COPY ./client ./client
COPY ./server ./server
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./lerna.json ./lerna.json
RUN npm install --unsafe-perm
RUN npm run build --unsafe-perm
RUN npm prune --production

WORKDIR /prod/
RUN cp /build/package.json ./package.json && \
    cp -r /build/dist ./dist && \
    cp -r /build/node_modules ./node_modules && \
    mkdir ./server && \
    cp -r /build/server/dist ./server/dist && \
    cp -r /build/server/node_modules ./server/node_modules && \
    mkdir ./api && \
    cp -r /build/api/dist ./api/dist && \
    cp /build/api/package.json ./api/package.json && \
    rm -r /build
COPY ./openshift ./openshift
COPY ./setTestEnvironment.sh ./setTestEnvironment.sh

EXPOSE 8080
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]
RUN chmod -R 775 ./*
RUN chgrp -R 1000 ./*
USER 1000:1000
ENV IMG=sakuli-dashboard
CMD ["node", "/prod/server/dist/index.js"]
