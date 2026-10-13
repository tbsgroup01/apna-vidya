FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Ensure uploads folder exists for file uploads (Multer)
RUN mkdir -p uploads

EXPOSE 3303

CMD ["node", "index.js"]