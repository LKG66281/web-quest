FROM node:20

RUN apt-get update && \
    apt-get install -y openjdk-17-jdk

# Verify Java installation
RUN java -version
RUN javac -version

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
