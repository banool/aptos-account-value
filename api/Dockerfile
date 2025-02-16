# All source paths here are relative to the root of the repo. Build locally by running
# this from the root of the repo:
# docker build -f api/Dockerfile -t aptos-account-value-api .

FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g corepack@latest
RUN corepack enable pnpm

FROM base AS builder

RUN apt update && apt install -y tini

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY library library
COPY api api

# Install dependencies.
RUN pnpm install --frozen-lockfile
RUN cd library && pnpm install --frozen-lockfile
RUN cd api && pnpm install --frozen-lockfile

# Build the library.
RUN cd library && pnpm build

# Build the API.
RUN cd api && pnpm compile

# Prune the devDependencies.
RUN pnpm prune --prod

EXPOSE 3002
CMD [ "/bin/tini", "--", "node", "/app/api/dist/src/server.js" ]
