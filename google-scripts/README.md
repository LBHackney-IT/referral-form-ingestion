# Google Scripts for processing Social Care MASH Referrals

## Prerequisites

- Node.js >v14
- Yarn 1.x

## Getting started

1.  Clone the repo
2.  Move into this directory

        cd ./google-scripts

3.  Install the dependencies

        yarn

4.  Run the tests

        yarn test

## Linting and formatting

We use [`prettier`](https://prettier.io/) to format our code in a consistent manner. You can check your code formatting by running:

    yarn lint

>Note: this is run automatically as part of the CI pipeline, and will fail the build if there are formatting issues

If errors are identified, you can fix them manually, or try and automatically fix them using:

    yarn format