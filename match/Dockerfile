FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 5003
CMD [ "node", "build/index.js" ]