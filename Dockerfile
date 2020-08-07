FROM node:12-slim
WORKDIR /prod/
COPY ./api /prod/api
COPY ./client /prod/client
COPY ./server /prod/server
COPY ./package.json /prod/package.json
COPY ./package-lock.json /prod/package-lock.json
COPY ./lerna.json /prod/lerna.json
COPY ./openshift /prod/openshift
COPY ./setTestEnvironment.sh /prod/setTestEnvironment.sh
EXPOSE 8080
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]
RUN npm install --unsafe-perm
RUN npm run build --unsafe-perm
RUN rm -r ./api/src && \
    rm -r ./client/src && \
    rm -r ./server/src
RUN chmod -R 775 ./*
RUN chgrp -R 1000 ./*
USER 1000:1000
ENV IMG=sakuli-dashboard
CMD ["node", "/prod/server/dist/index.js"]
