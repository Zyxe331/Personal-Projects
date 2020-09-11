FROM node:14.10.0
# Create app directory
WORKDIR /app

# Copy .env and Install app dependencies
COPY .env ./
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

#ls
#RUN ls -a


# Bundle app source
COPY . /app

#The app binds to 3000, so EXPOSE will have it mapped by the docker daemon
EXPOSE 3000

#Define the commands to run the server
CMD [ "node", "index.js" ]