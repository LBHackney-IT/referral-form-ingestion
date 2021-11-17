variable "resource_name_prefix" {
  type        = string
  description = "Will be used as a prefix for the resources. It can also be the name of the project."
}

variable "environment" {
  type        = string
  description = "Enviroment e.g. dev, stg, prod"
}

variable "region" {
  type        = string
  description = "The AWS region the resources will be deployed into."
}
