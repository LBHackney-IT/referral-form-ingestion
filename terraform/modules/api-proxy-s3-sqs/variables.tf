variable "api_gateway_account_name_prefix" {
  type        = string
  description = "Prefix used to describe the gateway account"
}

variable "rest_api_s3_proxy_name" {
  type        = string
  description = "Name of the REST API acting as the S3 proxy"
}

variable "environment" {
  type        = string
  description = "Enviroment e.g. dev, stg, prod"
}

variable "core_region" {
  type    = string
  default = "eu-west-2"

  description = "The AWS region the resources will be deployed into."
}

variable "bucket_name" {
  type        = string
  description = "Name of bucket that connects with REST API"
}

variable "queue_name_prefix" {
  type        = string
  description = "Prefix used to describe of main queue and dead letter queues"
}
