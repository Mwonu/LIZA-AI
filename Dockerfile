FROM node:18-slim

# സിസ്റ്റം പാക്കേജുകൾ ഇൻസ്റ്റാൾ ചെയ്യുന്നു
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    imagemagick \
    webp \
    git && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ആദ്യം package.json മാത്രം കോപ്പി ചെയ്ത് ഇൻസ്റ്റാൾ ചെയ്യുന്നു
COPY package.json .
RUN npm install --production

# ബാക്കി ഫയലുകൾ കോപ്പി ചെയ്യുന്നു
COPY . .

# പോർട്ട് സെറ്റിംഗ്സ് (റെയിൽവേയ്ക്കും മറ്റും അനുയോജ്യമായത്)
ENV PORT=7860
EXPOSE 7860

CMD ["node", "index.js"]
