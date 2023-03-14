# build environment
FROM node:16-alpine as build

RUN apk add --no-cache python3 make g++

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY yarn.lock ./
COPY src src
COPY public public
COPY nginx nginx

RUN echo "Contents of public:"
RUN ls -la /app/public

ENV NODE_ENV=production
ENV REACT_APP_BASE_PATH=""

RUN npm install --silent --force --global yarn
RUN yarn

RUN yarn build

# production environment
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
