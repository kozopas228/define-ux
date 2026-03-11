FROM node:20.10.0-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci \
    && npm cache clean --force

COPY . .

RUN npm run build -- --env analyzeBundle=false

FROM build as prod

ENV PORT 80

EXPOSE 80

CMD ["node", "server.js"]
