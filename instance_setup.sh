#!/bin/bash

# Variables
region="us-east-1"
configuration_file="/home/admin/cloudwatch-config.json"

# Setting up cloudwatch
wget https://s3.${region}.amazonaws.com/amazoncloudwatch-agent-${region}/debian/amd64/latest/amazon-cloudwatch-agent.deb

echo "Done with wget"
# Install cloudwatch
sudo dpkg -i ./amazon-cloudwatch-agent.deb || sudo apt-get -f install

# Check if the CloudWatch Agent was installed successfully
if ! type /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl > /dev/null 2>&1; then
  echo "CloudWatch Agent installation failed."
  exit 1
fi

sudo mkdir /var/log/tomcat9

# Copy configuration file to the CloudWatch Agent directory
sudo cp "$configuration_file" /opt/aws/amazon-cloudwatch-agent/etc/

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

