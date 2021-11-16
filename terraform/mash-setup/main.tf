terraform {
  backend "s3" {
    # bucket  = your bucket name (need to create a bucket)
    encrypt = true
    region  = "eu-west-2"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

module "mash_data_processing" {
  source = "../modules/api-proxy-s3-sqs"

  project_name                    = "social-care-referrals"
  environment                     = "stg"
}
