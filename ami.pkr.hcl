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

variable "ami_name" {
  type = string
  default = "Assignment5"
}

variable "source_ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9" # Debian 12
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "aws_access_key" {
  type = string
  default = env("AWS_DEV_ACCESS_KEY")
}

variable "aws_secret_key" {
  type = string
  default = env("AWS_DEV_SECRET_KEY")
}

variable "demo_account" {
  type= string
  default = "987654320394"
}

# https://www.packer.io/plugins/builders/amazon/ebs
source "amazon-ebs" "my-ami" {
  
  region          = "${var.aws_region}"
  ami_name        = "${var.ami_name}"
  ami_description = "AMI for CSYE 6225"
  ami_users = [ "${var.demo_account}" ]
  access_key =  "${var.aws_access_key}"
  secret_key =  "${var.aws_secret_key}"
  tags = {
    "Usage" : "Assignment5"
  }
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

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  sources = ["source.amazon-ebs.my-ami"]  

  provisioner "file" {

    source = "project.tar.gz"
    destination = "/home/admin/project.tar.gz"
  }

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1"
    ]
    scripts = [
      "instance_setup.sh"
    ]
  }
}