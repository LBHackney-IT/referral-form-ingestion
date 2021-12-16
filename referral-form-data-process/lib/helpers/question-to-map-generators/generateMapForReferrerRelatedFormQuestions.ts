export function generateMapForReferrerRelatedFormQuestions(): Map<
  string,
  string
> {
  return new Map([
    ["Referrer First Name", "referrerFirstName"],
    ["Referrer Last Name", "referrerLastName"],
    [
      "What support do you think the child(ren) would benefit from?",
      "requestedSupport",
    ],
  ]);
}
