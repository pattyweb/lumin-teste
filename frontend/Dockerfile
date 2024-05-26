FROM node:14

WORKDIR /usr/src/app

# Set environment variable to suppress warnings
ENV NODE_OPTIONS="--no-warnings"

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "start"]

