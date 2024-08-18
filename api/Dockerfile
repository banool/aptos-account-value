# All source paths here are relative to the root of the repo. Build locally by running
# this from the root of the repo:
# docker build -f api/Dockerfile -t aptos-account-value-api .

FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder

WORKDIR /build

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY library library
COPY api api

RUN pnpm install --frozen-lockfile
