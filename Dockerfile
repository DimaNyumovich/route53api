FROM node:18

RUN npm i -g  typescript
WORKDIR /
COPY . .

RUN npm install
RUN tsc

CMD ["npm", "start"]

