# Assignment 3 - Webapp

## Installation 
1. Install npm (On linux you can use `sudo apt-get install npm`)
2. Install mysql (On linux you can use [this](https://www.digitalocean.com/community/tutorials/how-to-install-mariadb-on-debian-11) tutorial)
   
## Prerequisites for building and deploying your application locally
1. Run `npm i` on the root directory
2. Run `node index.js` this should run the application
3. To test the healthz api run `npm test`

## Build and Deploy instructions for the web application
1. Run `tar -czvf webapp.tar.gz` to compress
2. Run `scp -i [identity-file] webapp.tar.gz [username]@[server-ip]`
3. Connect to server using `ssh` command
4. Follow the steps mentioned above to run, make sure the .env file is configured properly

## Packer instructions
1. Run `packer init .`
2. Run `packer build ami.pkr.hcl`
