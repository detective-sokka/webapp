#!/bin/bash       
sudo apt-get update
sudo apt install mariadb-server -y
sudo apt install nodejs npm -y  
sudo apt-get install unzip
unzip project.zip -d .
sudo rm -r node_modules
sudo rm project.zip
sudo npm i
sudo mysql -u root -proot -e 'CREATE DATABASE IF NOT EXISTS saiDB;'
sudo mysql -u root -proot -e "CREATE USER 'sai'@'localhost' IDENTIFIED BY 'sai'";
sudo mysql -u root -proot -e "GRANT ALL PRIVILEGES ON saiDB.* TO 'sai'@'localhost'";
sudo npm test