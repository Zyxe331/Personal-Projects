# Vet-20-21

## Stack Overview:
- Client: Ionic app built in JS/TS
- Backend: Express api service running in node.js
- Database: MySQL
- Web Server: Nginx


## Deploying the application:
**/////////Requires attention and more investigation/////////**

It looks like the application is deployed inside a ubuntu container, with [pm2](https://pm2.keymetrics.io/) to handle monitoring and running the processes and [nginx](https://docs.nginx.com/) for load balancing.
More research has to be done to reverse engineer the current configuration.

For deployment of new changes it is unsure of what the rollback plan would be, but it seems that the way to push a new version of the app to the server is to use pscp to upload the master branch to the server and overwrite the current version.

## Managing the server and client:
### Starting the server: `pm2 start server`
### Starting the client: `pm2 ionic`
### Monitor logs and usage: `pm2 monit`
Please read the [pm2 documentation](https://pm2.keymetrics.io/docs/usage/quick-start/) for more informationand other commands, or run `pm2 --help`.


## Renewing the site certificate:
The certificate has been issued by [Cert-bot](https://certbot.eff.org/). If the certificate has expired, there are a couple of things that need to be done:
 - Get the new cert from cert bot by running ```sudo certbot renew```
 - Copy the new fullchain cert and private key into the /server/certs folder (This step needs to be scripted or fixed somehow)