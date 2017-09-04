# Angular App ========================================
FROM johnpapa/angular-cli as angular-app
LABEL authors="John Papa"
# Copy and install the Angular app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN ng build --prod
# Generate the PWA's Service Worker
RUN npm run generate-sw

#Express server =======================================
FROM node:6.11-alpine as express-server
WORKDIR /app
COPY /src/server /app
RUN npm install --production --silent

#Final image ========================================
FROM node:6.11-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY --from=express-server /app /usr/src/app
COPY --from=angular-app /app/dist /usr/src/app
ENV PORT 80
CMD [ "node", "index.js" ]
