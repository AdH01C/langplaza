# Use an LTS version of Node.js
FROM node:16-alpine AS builder

WORKDIR /app
COPY package.json yarn.lock ./

# Install build tools and node-gyp
RUN apk add --no-cache python3 make g++ && \
    ln -sf python3 /usr/bin/python && \
    yarn global add node-gyp

# Install dependencies
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build
