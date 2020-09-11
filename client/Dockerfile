FROM node:14.10.0-alpine3.12 as build

#Create wrorking directory and copy package.json
WORKDIR /app
COPY package*.json /app/

#install ionic and dependencies
RUN npm install -g @ionic/cli
RUN npm install

#Copy everything from root into the working directory and build the app
COPY ./ /app/
RUN npm run-script build

CMD ["npm", "start"]
#FROM nginx:alpine
#RUN rm -rf /usr/share/nginx/html/*
#COPY --from=build /app/www/ /usr/share/nginx/html/