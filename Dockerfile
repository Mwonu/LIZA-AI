FROM node:18-bullseye

# സിസ്റ്റം പാക്കേജുകൾ ഇൻസ്റ്റാൾ ചെയ്യുന്നു
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    imagemagick \
    webp && \
    rm -rf /var/lib/apt/lists/*

# പ്രോജക്റ്റ് ഫയലുകൾ കോപ്പി ചെയ്യുന്നു
WORKDIR /app
COPY package.json .
RUN npm install

COPY . .

# Hugging Face-ന് ആവശ്യമായ പോർട്ട്
EXPOSE 7860

CMD ["node", "index.js"]
