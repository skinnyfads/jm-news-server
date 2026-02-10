FROM node:22-slim AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Install unzip for dictionary download
RUN apt-get update && apt-get install -y unzip && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src/ src/
COPY scripts/ scripts/

# Download dictionary
RUN pnpm run download:jmdict

RUN pnpm build

FROM node:22-slim AS production

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data ./data
COPY client/ client/

EXPOSE 3000

CMD ["node", "dist/main.js"]
