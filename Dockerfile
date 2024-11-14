#stage 1 build
FROM node:18 AS builder

WORKDIR /build

COPY package* .
RUN npm install 

COPY src/ src/ 
COPY prisma/ prisma/
COPY tsconfig.json tsconfig.json



RUN npm install -g prisma
RUN npx prisma generate

RUN npm run build



#stage-2 Runner
FROM node:18 AS runner

WORKDIR /app

COPY --from=builder build/package* .
COPY --from=builder build/node_modules node_modules/
COPY --from=builder build/dist dist/

CMD [ "npm", "start"]