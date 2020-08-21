FROM node:12-slim AS builder
WORKDIR /build/
COPY ./api /build/api
COPY ./client /build/client
COPY ./server /build/server
COPY ./license-validator /build/license-validator
COPY ./package.json /build/package.json
COPY ./package-lock.json /build/package-lock.json
COPY ./lerna.json /build/lerna.json
RUN npm install --unsafe-perm
RUN npm run build --unsafe-perm
RUN npm prune --production
RUN npm --prefix ./license-validator install --unsafe-perm
RUN npm --prefix ./license-validator prune --production

FROM node:12-slim
WORKDIR /prod/
EXPOSE 8080
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini

#Copy the build artifacts as they currently are, as the docker build should not break s2i
#After the s2i build has been deactivated, frontend, backend and api should be merged.
COPY --from=builder /build/package.json ./package.json
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/server/dist ./server/dist
COPY --from=builder /build/server/node_modules ./server/node_modules
COPY --from=builder /build/api/dist ./api/dist
COPY --from=builder /build/api/package.json ./api/
COPY --from=builder /build/license-validator/out/dist/index.js ./env/index.js
COPY --from=builder /build/license-validator/node_modules ./env/node_modules

COPY ./startup.sh ./startup.sh

RUN chmod -R 775 ./*
RUN chgrp -R 1000 ./*

USER 1000:1000
ENV IMG=taconsol/sakuli-dashboard
ENTRYPOINT ["/tini", "--", "./startup.sh"]
CMD ["node", "/prod/server/dist/index.js"]