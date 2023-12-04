FROM node:20 as builder

WORKDIR /src/app

COPY . .

RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi && \
    yarn run lint && \
    yarn audit --level low && \
    yarn build

FROM node:20-alpine

WORKDIR /src/app

COPY --chown=node:node --from=builder /src/app/dist /src/app/dist
COPY --chown=node:node --from=builder /src/app/config /src/app/config
COPY --chown=node:node --from=builder /src/app/node_modules /src/app/node_modules
COPY --chown=node:node --from=builder /src/app/package.json /src/app/package.json
COPY --chown=node:node --from=builder /src/app/tsconfig.build.json /src/app/tsconfig.build.json

ENTRYPOINT [ "yarn", "start:prod" ]
