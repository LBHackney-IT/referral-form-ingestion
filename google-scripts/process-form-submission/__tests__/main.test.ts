import { onFormSubmit } from "../main";

global.Logger = {
  clear: () => {},
  getLog: () => "",
  log: jest.fn(),
};

describe("#onFormSubmit()", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should call the logger with the question names and values from the form submission", () => {
    const mockFormSubmission = {
      "First Name": ["Hello"],
      "Last Name": ["World"],
    };

    const mockEvent = {
      sample: "event",
      namedValues: mockFormSubmission,
    };

    onFormSubmit(mockEvent as any);

    expect(global.Logger.log).toHaveBeenCalledWith(
      "Hello, world! (from circleci) [test only push on main]",
      {
        event: mockEvent,
      }
    );
  });
});
