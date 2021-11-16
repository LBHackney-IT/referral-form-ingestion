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

  api_gateway_account_name_prefix = "social-care-api-gateway"
  rest_api_s3_proxy_name          = "social-care-referrals-s3-api"
  bucket_name                     = "social-care-referrals-bucket"
  queue_name_prefix               = "social-care-referrals"
  environment                     = "stg"
}
