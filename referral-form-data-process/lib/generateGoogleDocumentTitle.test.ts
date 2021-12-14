import { generateGoogleDocumentTitle } from "./generateGoogleDocumentTitle";

describe("#generateDocTitle", () => {
  it("should generate the title for the google document for one resident", () => {
    const mockFormData = {
      id: ["100"],
      SubmissionRowPosition: ["1"],
      "Child 1: Child's First Name": ["Sam"],
      "Child 1: Child's Last Name": ["Smith"],
      "Child 2: Child's First Name": [""],
      "Child 2: Child's Last Name": [""],
      "Child 3: Child's First Name": [""],
      "Child 3: Child's Last Name": [""],
    };

    const actualValue = generateGoogleDocumentTitle(mockFormData);
    const expectedValue = "Sam Smith | MASH";

    expect(actualValue).toBe(expectedValue);
  });

  it("should display the number of other residents included within referral beside the first client's name", () => {
    const mockFormData = {
      id: ["100"],
      SubmissionRowPosition: ["1"],
      "Child 1: Child's First Name": ["Peter"],
      "Child 1: Child's Last Name": ["Parker"],
      "Child 2: Child's First Name": ["Mary"],
      "Child 2: Child's Last Name": ["Jane"],
      "Child 3: Child's First Name": ["Apple"],
      "Child 3: Child's Last Name": ["Pie"],
      "Child 4: Child's First Name": ["Banana"],
      "Child 4: Child's Last Name": ["Pie"],
      "Child 5: Child's First Name": [""],
      "Child 5: Child's Last Name": [""],
      "Child 6: Child's First Name": [""],
      "Child 6: Child's Last Name": [""],
      "Child 7: Child's First Name": [""],
      "Child 7: Child's Last Name": [""],
      "Child 8: Child's First Name": [""],
      "Child 8: Child's Last Name": [""],
    };

    const actualValue = generateGoogleDocumentTitle(mockFormData);
    const expectedValue = "Peter Parker +3 | MASH";

    expect(actualValue).toBe(expectedValue);
  });

  it("should display 7 for the total number of other residents if all eight entries are filled in the form", () => {
    const mockFormData = {
      id: ["100"],
      SubmissionRowPosition: ["1"],
      "Child 1: Child's First Name": ["Apple"],
      "Child 1: Child's Last Name": ["Pie"],
      "Child 2: Child's First Name": ["Mary"],
      "Child 2: Child's Last Name": ["Jane"],
      "Child 3: Child's First Name": ["Cinnamon"],
      "Child 3: Child's Last Name": ["Bread"],
      "Child 4: Child's First Name": ["Banana"],
      "Child 4: Child's Last Name": ["Pie"],
      "Child 5: Child's First Name": ["Sam"],
      "Child 5: Child's Last Name": ["Smith"],
      "Child 6: Child's First Name": ["Alice"],
      "Child 6: Child's Last Name": ["Wonderland"],
      "Child 7: Child's First Name": ["Bob"],
      "Child 7: Child's Last Name": ["Cat"],
      "Child 8: Child's First Name": ["Joey"],
      "Child 8: Child's Last Name": ["Right"],
    };

    const actualValue = generateGoogleDocumentTitle(mockFormData);
    const expectedValue = "Apple Pie +7 | MASH";

    expect(actualValue).toBe(expectedValue);
  });
});
