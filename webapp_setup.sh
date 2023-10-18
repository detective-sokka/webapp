#!/bin/bash

# Define your server SSH details
server_address="144.126.222.60"
server_username="root"
server_path="/opt/Demo"

# Define your local project directory
local_project_directory="./webapp"

# Archive your Node.js project
tar -czvf project.tar.gz "$local_project_directory"

# Copy the archive to the server
scp -i ~/.ssh/DigitalOcean project.tar.gz "$server_username@$server_address:$server_path"

# SSH into the server and perform necessary actions
ssh -i ~/.ssh/DigitalOcean "$server_username@$server_address" << EOF
  # Navigate to the server project directory
  cd "/opt/Demo"

  # Extract the project archive
  tar -xzvf project.tar.gz

  # Remove the archive file
  rm project.tar.gz
  
  cd "webapp"

  # Install project dependencies using npm
  npm install

  # You can also run other deployment tasks here if needed
  # For example, building your project, restarting a server, etc.

  # Exit the SSH session
  exit
EOF

# Clean up the local archive file
rm project.tar.gz

echo "Deployment complete."
