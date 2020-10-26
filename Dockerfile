### STAGE 1: Build ###
FROM node:12.14.0-alpine3.10
RUN apk add \
  bash \
  g++ \
  make \
  python \
  vim

ENV DIRPATH=/opt/react-ssr
WORKDIR ${DIRPATH}
ENV PATH ${DIRPATH}/node_modules/.bin:$PATH

COPY package.json ${DIRPATH}/package.json
COPY package-lock.json ${DIRPATH}/package-lock.json

RUN npm ci
COPY . .

ARG runtime
ENV AURA_ENV=$runtime

ARG port
ENV PORT=$port

RUN npm run build

### STAGE 2: Production Environment ###
CMD npm run start:prod
EXPOSE ${PORT} 3000
