FROM node:12-alpine AS builder
WORKDIR /build/
COPY . /build
RUN npm install --unsafe-perm
RUN npm run build --unsafe-perm

FROM node:12-alpine
WORKDIR /prod/
COPY --from=builder /build/dist .
COPY --from=builder /build/server/dist ./server
RUN chmod -R 775 ./*
RUN chgrp -R 1000 ./*
USER 1000:1000
CMD ["node /prod/server/dist/index.js"]