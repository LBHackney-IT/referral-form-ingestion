variable "resource_name_prefix" {
  type        = string
  description = "Will be used as a prefix for the resources. It can also be the name of the project."
}

variable "environment" {
  description = "The application environment for this deployment."
  type        = string
  validation {
    condition     = contains(["dev", "stg", "prod"], var.environment)
    error_message = "Environment must be one of dev, stg or prod."
  }
}

variable "region" {
  type        = string
  description = "The AWS region the resources will be deployed into."
}
