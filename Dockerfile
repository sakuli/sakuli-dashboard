FROM node:12-slim
WORKDIR /prod/
COPY . /prod
EXPOSE 8080
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]
RUN npm install --unsafe-perm
RUN npm run build --unsafe-perm
RUN chmod -R 775 ./*
RUN chgrp -R 1000 ./*
USER 1000:1000
CMD ["node", "/prod/server/dist/index.js"]