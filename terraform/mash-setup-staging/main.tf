provider "aws" {
  region = "eu-west-2"
}

terraform {
  backend "s3" {}
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}
module "mash_data_processing" {
  source = "../modules/api-proxy-s3-sqs"

  resource_name_prefix = "social-care-referrals"
  region               = "eu-west-2"
  environment          = "stg"
}
