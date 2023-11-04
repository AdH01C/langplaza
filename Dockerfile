# Build stage
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

# Production stage
FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Start the server using yarn start
EXPOSE 3000
CMD ["yarn", "start"]
