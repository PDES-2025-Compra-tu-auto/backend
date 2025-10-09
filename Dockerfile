FROM node:22-alpine AS build

WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH

COPY package.json ./
RUN npm install --silent 
COPY . ./
RUN npm run build 

FROM node:22-alpine AS production
WORKDIR /app
COPY --from=build /app/package.json ./package.json 
COPY --from=build /app/package-lock.json ./package-lock.json 
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE 4000

CMD ["sh","-c","npm run start:prod"]
