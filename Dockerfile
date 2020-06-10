FROM node:12-slim AS builder
WORKDIR /build/
COPY . /build
RUN npm install --unsafe-perm
RUN npm run build --unsafe-perm

FROM node:12-slim
WORKDIR /prod/
EXPOSE 8080
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]
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
CMD ["node", "/prod/server/dist/index.js"]