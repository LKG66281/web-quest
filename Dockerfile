FROM node:20

# Install Java + verify
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk && \
    java -version && javac -version

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Pre-create temp dir
RUN mkdir -p /tmp/java && chmod 777 /tmp/java

EXPOSE 5000

CMD ["npm", "start"]
