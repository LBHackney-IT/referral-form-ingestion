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

  application = "social-care-referrals"
  region      = "eu-west-2"
  environment = "stg"
}

resource "aws_secretsmanager_secret" "gcp_service_account_client_email" {
  name        = "${local.resource_prefix}-gcp-service-account-client-email"
  description = "The client email associated with the Social Care Referrals Google Service Account"
}

resource "aws_secretsmanager_secret" "gcp_service_account_private_key" {
  name        = "${local.resource_prefix}-gcp-service-account-private-key"
  description = "The private key for the Social Care Referrals Google Service Account"
}

resource "aws_secretsmanager_secret" "referrals_google_doc_template_id" {
  name        = "${local.resource_prefix}-referrals-google-doc-template-id"
  description = "The ID of the MASH Google template document"
}

resource "aws_secretsmanager_secret" "referrals_google_spreadsheet_id" {
  name        = "${local.resource_prefix}-referrals-google-spreadsheet-id"
  description = "The ID of the MASH spreadsheet"
}
