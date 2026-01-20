FROM node:lts-buster

# system packages installing
RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  imagemagick \
  webp && \
  apt-get upgrade -y && \
  rm -rf /var/lib/apt/lists/*

# project files copying
COPY package.json .
RUN npm install

COPY . .

#  hugging face using port
EXPOSE 7860

CMD ["node", "index.js"]
