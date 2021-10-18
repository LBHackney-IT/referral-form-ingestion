# Social Care Referral Form Ingestion Process

This project processes the data submitted via the MASH (Multi agency Safeguarding Hub) Referrals Google form and enters the data into the Social Care System.

![C4 Component Diagram](docs/mash-data-import.svg)

## Table of Contents

- [Social Care Referral Form Ingestion Process](#social-care-referral-form-ingestion-process)
  - [Table of Contents](#table-of-contents)
  - [Documentation](#documentation)
    - [Architecture](#architecture)
      - [Google Side of Things](#google-side-of-things)
      - [AWS Side of Things](#aws-side-of-things)
    - [Brainstorming the new process design](#brainstorming-the-new-process-design)
    - [Google Authentication](#google-authentication)
  - [Deployments](#deployments)
    - [How to configure CircleCI for automated deployment of our appscript](#how-to-configure-circleci-for-automated-deployment-of-our-appscript)
  - [Troubleshooting](#troubleshooting)
    - [Clasp push suddenly stops working](#clasp-push-suddenly-stops-working)
  - [Related repositories](#related-repositories)
  - [Active contributors](#active-contributors)
  - [License](#license)

## Documentation

### Architecture

There are two main ecosystems involved in this ingestion process - Google & AWS.

#### Google Side of Things

Once the form data is submitted, it appears in a Google Sheet.
Apps script code is triggered by the submission which then:

- Generates a unique Id for the form data
- Updates the row for that specific submission to include this unique Id
- Sends the form data and its ID to AWS where the data will be further processed.

The Google Apps script code makes an HTTP PUT request to add an object containing the form data to the `form-submissions` folder in our S3 bucket.

#### AWS Side of Things

Once the object is successfully created in S3, the S3 bucket creates an event notification and pushes it to a main queue in SQS.
When a message enters the main queue, it would trigger a lambda function.
The lambda function would:

- receive information about the event and use it to retrieve the form data object in S3.
- use the form data to generate a Google Document which would be saved in a restricted drive.
- update the row in the Google Sheet specific to that form data to include an edit URL of the generated Google Document.

Once the MASH Google Sheet has been updated, the form data, its ID and its Google Doc URL will be saved in a database in the Social Care System.

### Brainstorming the new process design

This goal of this project is to replace the existing process which is quite brittle with a more robust one while incoporating the workflow into the Social Care System.

The [initial MASH handover board](https://miro.com/app/board/o9J_l-7l2BU=/) describes the current process steps, suggestions of UI and ways we could automate the process within the System.

![Sequence Diagram](docs/mash-data-import-sequence.svg)

### Google Authentication

The lambda which creates a new google doc and inserts it into the spreadsheet requires authentication. The steps required to set up this authentication are:

1. Find out who is the most sensible person within Hackney to create a [Google Cloud project](https://console.cloud.google.com/projectselector2/iam-admin/serviceaccount)
2. Once the project has been created, a service account must be created within the project
3. After the service account has been created, you must retrieve its credentials which can be downloaded on the service account management page
4. The important properties from the service account credentials are: `client_email` & `private_key`. The credentials must be retrieved from the person who created the service account and should be stored safely in AWS secrets manager
5. The service account requires the following API access added from the Google cloud console: Drive, Spreadsheets, Documents
6. The service account email must also be added as an editor to the desired spreadsheet

## Deployments

### How to configure CircleCI for automated deployment of our appscript

1. In your browser go to the google sheet we are looking to deploy our app script against
2. In the sheet click tools -> script editor
3. In the script editor view go to settings (click cog icon)
4. Copy the Script ID value
5. Go to google-scripts/clasp.json and update the value associated with scriptId with what you just copied

## Troubleshooting

### Clasp push suddenly stops working

In case of needing to configure our CircleCi credentials again (if clasp push suddenly stops working consider this)

1. Install clasp globally on your system `npm i -g @google/clasp`
2. In your terminal type `clasp login`, your browser should open prompting you to login to a google account, login, you can close the browser once you have logged in
3. locally on your system in your root directory should now exist a file called `.clasprc.json`, output the values to your terminal by typing `cat ~/.clasprc.json`
4. In your terminal you should now see the contents of a JSON file, there should be a key called "refresh_token", we want to copy the value associated with the "refresh_token" key (not including the double quotes)
5. With the refresh_token go to [CircleCI referral form ingestion environment variables](https://app.circleci.com/settings/project/github/LBHackney-IT/social-care-referral-form-ingestion/environment-variables?return-to=https%3A%2F%2Fapp.circleci.com%2Fpipelines%2Fgithub%2FLBHackney-IT%2Fsocial-care-referral-form-ingestion) and remove the existing environment variable "CLASP_REFRESH_TOKEN"
6. Now click to add a new environment variable, call it "CLASP_REFRESH_TOKEN" and give it the value of the refresh_token that you copied from your local ~/.clasprc.json file

## Related repositories

| Name                                                                                         | Purpose                                                                                                                                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [LBH Social Care Frontend](https://github.com/LBHackney-IT/lbh-social-care-frontend)         | Provides the UI/UX of the Social Care System.                                                                                                                                                                                                                                                               |
| [Social Care Case Viewer API](https://github.com/LBHackney-IT/social-care-case-viewer-api)   | Provides [service API](http://playbook.hackney.gov.uk/API-Playbook/platform_api_vs_service_api#a-service-apis) capabilities to the Social Care System.                                                                                                                                                      |
| [Infrastructure](https://github.com/LBHackney-IT/infrastructure/tree/master/projects/mosaic) | Provides a single place for AWS infrastructure defined using [Terraform](https://www.terraform.io) as [infrastructure as code](https://en.wikipedia.org/wiki/Infrastructure_as_code) as part of Hackney's new AWS account strategy. The S3 bucket (with API gateway) & SQS resources are deployed from here |
| [API Playbook](http://playbook.hackney.gov.uk/API-Playbook/)                                 | Provides guidance to the standards of APIs within Hackney.                                                                                                                                                                                                                                                  |

## Active contributors

- **Marta Pederiva**, Junior Developer at Hackney (marta.pederiva@hackney.gov.uk)
- **Miles Alford**, Software Developer Apprentice at Hackney (miles.alford@hackney.gov.uk)
- **John Farrell**, Senior Software Engineer at Made Tech (john.farrell@hackney.gov.uk)
- **Renny Fadoju**, Software Engineer at Made Tech (renny.fadoju@hackney.gov.uk)

## License

[MIT License](LICENSE)
