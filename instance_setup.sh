#!/bin/bash

sudo apt-get update 
sudo apt-get upgrade -y        
sudo apt-get clean 
sudo apt install mariadb-server -y        
sudo systemctl status mariadb  
sudo apt install nodejs npm -y  
nodejs --version && npm --version       
rm -r /usr/bin/git
sudo tar -xzvf project.tar.gz -C .
sudo rm -r node_modules
sudo npm i
sudo mysql_secure_installation << EOF 
root
n
n
n
n
n
n
EOF
sudo mysql -u root -proot -e  'CREATE DATABASE IF NOT EXISTS saiDB;  '