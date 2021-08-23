export function onFormSubmit(
  event: GoogleAppsScript.Events.SheetsOnFormSubmit
) {
  Logger.log(JSON.stringify(event.namedValues), {
    event,
  });
}
