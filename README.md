# Assignment 3 - Webapp

## About this repository

This is the back-end of the student assignment submission portal web application that is hosted on an AWS EC2 instance. 

### Technologies used
1. **Node.js**(javascript) - Used to run the backend of the application
2. **Github actions** using YAML - Running unit tests and integrations tests to ensure Continuos Testing and Continuous Integration
3. **Bash** script (instance_setup.sh) - Used to setup the web application and install the dependencies in the Virtual machine
4. **MySql** database using **Sequelize** ORM - Used to store the user login data, assignments and submissions.
5. HCL **packer** script (ami.pkr.hcl) - Used to create the AMI in the dev environment

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
