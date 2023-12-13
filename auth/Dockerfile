FROM node:16.17
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

CMD [ "npm", "run", "start" ]

EXPOSE 5001