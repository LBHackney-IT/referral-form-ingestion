# API Gateway → S3 → SQS

This module contains all the resources needed to create an API proxy for S3 and to set up S3 PUT object event notifications that are passed to SQS.

This is part of a wider [piece of work](https://hackney.atlassian.net/browse/SCT-1464) to separate the MASH resources from the other production resources in the [infrastructure repo](https://github.com/LBHackney-IT/infrastructure/tree/master/projects/mosaic).

We've done this so that we can deploy to either staging or production without the risk that comes from having duplicate terraform files being managed in two separate repos.

By creating a module, we want to have a single source of truth for how these resources are defined and then import the module in the relevant repos for deploying to staging (via this project's pipeline) and for deploying to production (via the infrastructure repo).

## Usage

Copy the code below and fill in the parameters with the appropriate values.

```text
module "mash_data_processing" {
    source = path or url to-module

    resource_name_prefix = name prefix for the resources created
    region = region
    environment = environment
}
```
