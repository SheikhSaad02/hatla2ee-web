FROM node:22-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 3000

CMD ["yarn", "start", "-H", "0.0.0.0", "-p", "3000"]
