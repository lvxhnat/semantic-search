# Use Node.js 18 as the base image
FROM node:18 as build-stage

WORKDIR /app/frontend
ENV PATH /app/node_modules/.bin:$PATH

# Copy package files
COPY frontend/package.json .
COPY frontend/yarn.lock .

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of your frontend code
COPY frontend .

# Build the project
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
