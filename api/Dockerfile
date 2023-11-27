FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder

WORKDIR /build

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm compile

RUN ls -a dist

FROM base AS runner

RUN apt update && apt install -y tini

WORKDIR /app

COPY --from=builder /build/dist /app

ENV NODE_ENV production

# This will install only the prod deps.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

EXPOSE 3002
CMD [ "/bin/tini", "--", "node", "/app/src/server.js" ]
