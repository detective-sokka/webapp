#!/bin/bash
# Creating users 
sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /home/csye6225 -m csye6225

# Moving service file
sudo cp '/home/admin/webapp.service' '/etc/systemd/system/csye6225.service'
sudo mv '/home/admin/project.zip' '/home/csye6225/project.zip'

# Setting up the dependencies
cd '/home/csye6225/' || exit
sudo apt-get update
sudo apt install nodejs npm -y  
sudo apt-get install unzip
sudo unzip project.zip -d webapp

sudo rm project.zip
sudo touch ./webapp/.env
sudo rm -r ./webapp/node_modules
sudo chmod -R 755 webapp