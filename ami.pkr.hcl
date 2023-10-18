packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = ">= 1.0.0"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9" # Debian 12
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "subnet_id" {
  type    = string
  default = env("AWS_SUBNET")
}

variable "aws_access_key" {
  type = string
  default = "AKIAQJXEJFWHHBOG47CH"//env("AWS_DEV_ACCESS_KEY")
}

variable "aws_secret_key" {
  type = string
  default = "9udcGV9yUZzO38FUd2bAMQMCm10wr/TPiQbdW5fu"//env("AWS_DEV_SECRET_KEY")
}

# https://www.packer.io/plugins/builders/amazon/ebs
source "amazon-ebs" "my-ami" {
  
  region          = "${var.aws_region}"
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "AMI for CSYE 6225"
  access_key =  "${var.aws_access_key}"
  secret_key =  "${var.aws_secret_key}"

  ami_regions = [
    "us-east-1",
  ]

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  instance_type = "t2.micro"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  subnet_id     = "${var.subnet_id}"

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  sources = ["source.amazon-ebs.my-ami"]

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1"
    ]
    inline = [
      "sudo apt-get update",
      "sudo apt-get upgrade -y",
      "sudo apt-get clean",
      "sudo apt install mariadb-server -y",
      #"sudo mysql_secure_installation",
      "sudo systemctl status mariadb",
      "sudo apt install nodejs npm -y",
      "nodejs --version && npm --version"
    ]
  }

  provisioner "file" {

    source = "project.tar.gz"
    destination = "/tmp/project.tar.gz"
  }
}