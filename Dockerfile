FROM node:14-buster-slim AS builder
WORKDIR /build/
COPY ./api /build/api
COPY ./client /build/client
COPY ./server /build/server
COPY ./package.json /build/package.json
COPY ./package-lock.json /build/package-lock.json
COPY ./lerna.json /build/lerna.json
RUN npm install --unsafe-perm
RUN npm run build --unsafe-perm
RUN npm prune --production

FROM node:14-buster-slim
WORKDIR /prod/
EXPOSE 8080
RUN apt-get update && \
    apt-get install -y node-gyp && \
    apt-get clean -y && \
    apt-get autoremove -y

#Copy the build artifacts as they currently are, as the docker build should not break s2i
#After the s2i build has been deactivated, frontend, backend and api should be merged.
COPY --from=builder /build/package.json ./package.json
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/server/dist ./server/dist
COPY --from=builder /build/server/node_modules ./server/node_modules
COPY --from=builder /build/api/dist ./api/dist
COPY --from=builder /build/api/package.json ./api/

RUN chmod -R 775 ./*
RUN chgrp -R 1000 ./*

USER 1000:1000
ENV IMG=taconsol/sakuli-dashboard
CMD ["node", "/prod/server/dist/index.js"]