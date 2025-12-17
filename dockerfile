FROM node:20-alpine AS builder
WORKDIR /app

# Copiar package.json y lockfile
COPY package.json package-lock.json ./
RUN npm ci

# Copiar el resto del proyecto
COPY . .
# Construir la aplicación
RUN npm run build

# --- Runtime ---
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV production

# Copiar solo el output standalone
COPY --from=builder /app/.next/standalone ./
# Copiar los assets
COPY --from=builder /app/.next/static ./.next/static
# Copiar public folder
COPY --from=builder /app/public ./public

# Exponer el puerto 3000
EXPOSE 3000

# Ejecutar la aplicación
CMD ["node", "server.js"]