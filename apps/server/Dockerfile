FROM node:20-bullseye-slim

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml turbo.json ./

# Copy application code
COPY apps/server/ ./apps/server/
COPY packages/ ./packages/

# Create pnpm workspace file
RUN echo 'packages:\n  - "apps/server"\n  - "packages/*"' > pnpm-workspace.yaml

# Create .env file at root for Prisma
RUN echo 'DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"' > .env

# Install dependencies
RUN pnpm install --frozen-lockfile

# Don't modify prisma.config.ts - just generate with the .env file present
WORKDIR /app/packages/database
RUN npx prisma generate

# Build the server
WORKDIR /app/apps/server
RUN pnpm build

# Set runtime environment variables
ENV NODE_ENV=production
ENV PORT=8787

EXPOSE 8787
CMD ["pnpm", "start"]