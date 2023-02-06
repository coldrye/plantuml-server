FROM node:lts-bullseye

# Create and change to the app directory.
WORKDIR /app

RUN apt-get update && \
    apt-get -y install graphviz openjdk-11-jre-headless && \
    apt-get clean && \
    curl -L https://github.com/plantuml/plantuml/releases/download/v1.2023.0/plantuml.jar -o plantuml.jar

COPY package*.json ./src tsconfig* ./

RUN npm install && \
    npm run build

EXPOSE 8080

# Run the web service on container startup.
CMD [ "npm", "start" ]

