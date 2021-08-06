export function onFormSubmit(event: GoogleAppsScript.Events.FormsOnFormSubmit) {
  Logger.log("Hello, world! (from circleci) [test only push on main]", {
    event,
  });
}
