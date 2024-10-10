FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s CMD curl -f http://localhost:5858/health || exit 1

CMD ["npm", "run", "dev"]