# API Gateway → S3 → SQS

This module contains all the resources needed to create an API proxy for S3 and setting up S3 event notifications to SQS.

This is part of a wider piece of work to separate the MASH resources from the other production resources in the infrastructure Repo so that we can deploy to staging as well without the risk that comes from having duplicate terraform files for the same resources but being deployed to different environment.

By creating a module, we want to have a single source of truth for how these resources are defined and then import the module in the relevant repos for deploying to staging and for deploying to production.
