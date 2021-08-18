[Miro board tracking Spike](https://miro.com/app/board/o9J_l-7l2BU=/)

MASH - Multi agency Safeguarding Hub (new name of the future service)

[MASH data import proof of conept](https://github.com/LBHackney-IT/social-care-architecture/blob/main/static/img/diagrams/mash-data-import.svg)

[Social Care Case Viewer API](https://github.com/LBHackney-IT/social-care-case-viewer-api)

Project to ingest information from our referral form into the Social Care Case Viewer API


## How to configure CircleCI for automated deployment of our appscript

1. In your browser go to the google sheet we are looking to deploy our app script against
2. In the sheet click tools -> script editor
3. In the script editor view go to settings (click cog icon)
4. Copy the Script ID value
5. Go to google-scripts/clasp.json and update the value associated with scriptId with what you just copied

## In case of needing to configure our CircleCi credentials again (if clasp push suddenly stops working consider this)

1. Install clasp globally on your system `npm i -g @google/clasp`
2. In your terminal type `clasp login`, your browser should open prompting you to login to a google account, login, you can close the browser once you have logged in
3. locally on your system in your root directory should now exist a file called `.clasprc.json`, output the values to your terminal by typing `cat ~/.clasprc.json`
4. In your terminal you should now see the contents of a JSON file, there should be a key called "refresh_token", we want to copy the value associated with the "refresh_token" key (not including the double quotes)
5. With the refresh_token go to [CircleCI referral form ingestion environment variables](https://app.circleci.com/settings/project/github/LBHackney-IT/social-care-referral-form-ingestion/environment-variables?return-to=https%3A%2F%2Fapp.circleci.com%2Fpipelines%2Fgithub%2FLBHackney-IT%2Fsocial-care-referral-form-ingestion) and remove the existing environment variable "CLASP_REFRESH_TOKEN"
6. Now click to add a new environment variable, call it "CLASP_REFRESH_TOKEN" and give it the value of the refresh_token that you copied from your local ~/.clasprc.json file
