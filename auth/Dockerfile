FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

CMD [ "node", "build/index.js" ]

EXPOSE 5001
