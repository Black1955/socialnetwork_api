FROM node:18 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . . 
RUN npm run build




FROM node:18 as final
WORKDIR /app
EXPOSE 5000
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./


ENV PORT=5000 \
    TOKEN=oleg \
    USER_DB=postgres \
    DB_PORT=5432 \
    DB_PASSWORD=qweawdaw\
    DB_HOST=localhost \
    DATABASE=socialnetwork \
    SECRET_FILE=ndajkwdnNdjkwa \
    LOCAL_STORAGE_PATH=/files \
    ORIGIN=localhost

RUN npm install --omit=dev

CMD ["npm", "run", "start"]