#!/bin/bash     
sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225

sudo cp /home/admin/project.zip /opt/csye6225/project.zip

cd '/opt/csye6225' || exit
sudo apt-get update
sudo apt install nodejs npm -y  
sudo apt-get install unzip
sudo unzip project.zip -d .
sudo rm project.zip
sudo rm -r node_modules
sudo npm i
sudo chown -R csye6225:csye6225 .
sudo chmod -R 755 .

sudo cp '/home/admin/webapp.service' '/etc/systemd/system/csye6225.service'
sudo systemctl daemon-reload
sudo systemctl enable csye6225
sudo systemctl start csye6225
sudo systemctl restart csye6225
