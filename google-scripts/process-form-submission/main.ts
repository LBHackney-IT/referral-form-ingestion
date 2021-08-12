export function onFormSubmit(
  event: GoogleAppsScript.Events.SheetsOnFormSubmit
) {
  Logger.log("Hello, world! (from circleci) [test only push on main]", {
    event,
  });
}
