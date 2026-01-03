FROM node:23 AS node-builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:23

WORKDIR /app
COPY --from=node-builder /app/dist ./dist
COPY --from=node-builder /app/package.json ./
COPY --from=node-builder /app/package-lock.json ./

RUN npm install --omit=dev

ENV HOST=0.0.0.0
ENV PORT=5000
EXPOSE 5000

CMD ["node", "./dist/server/entry.mjs"]