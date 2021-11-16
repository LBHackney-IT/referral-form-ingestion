variable "project_name" {
  type        = string
  description = "Name that will be used as prefix for names of the REST API, S3 bucket and SQS queues"
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