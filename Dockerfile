FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3001 1883 8888
CMD [ "npm", "start" ]
