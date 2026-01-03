FROM node:23-alpine AS builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5001
CMD [ "npm", "run", "preview" ]