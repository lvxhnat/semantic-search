FROM debian:buster-slim
FROM node:14.17.3 as build-stage

WORKDIR /app/frontend
ENV PATH /app/node_modules/.bin:$PATH

# Update package sources to use Debian Buster repositories
RUN sed -i 's/stretch/buster/' /etc/apt/sources.list

COPY frontend/package.json .
COPY frontend/yarn.lock .

# Install dependencies using Yarn
RUN yarn install

COPY frontend .

# Build the project
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
