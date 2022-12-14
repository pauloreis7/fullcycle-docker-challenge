FROM node:16-alpine as deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY --chown=node:node package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then rm -rf node_modules && yarn install --frozen-lockfile --ignore-scripts --immutable --immutable-cache --check-cache; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM node:16-alpine as builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .

ENV PATH /app/node_modules/.bin:$PATH

RUN yarn build

RUN yarn --production --prefer-offline --force --frozen-lockfile \
  && yarn cache clean --force

FROM node:16-alpine as runner

ENV HOME /home/user
ENV APP_HOME ${HOME}/app

RUN mkdir -p ${HOME}
RUN mkdir ${APP_HOME} && chown node:node ${APP_HOME}

WORKDIR ${APP_HOME}

ENV PATH /app/node_modules/.bin:$PATH
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ENV DOCKERIZE_VERSION v0.6.1
RUN deluser --remove-home node \
  && addgroup -S node -g 1000 \
  && adduser -S -G node -u 999 node

RUN apk add --no-cache openssl

RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

USER node

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./

EXPOSE 8080

CMD ["node", "server.js"]
