provider "aws" {
  region = "eu-west-2"
}
terraform {
  backend "s3" {}
}
module "mash_data_processing" {
  source = "../modules/api-proxy-s3-sqs"

  application = "social-care-referrals"
  region      = "eu-west-2"
  environment = "stg"
}
