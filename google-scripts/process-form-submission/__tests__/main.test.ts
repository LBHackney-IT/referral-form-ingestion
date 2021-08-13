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

  it("should call the logger with the data of the cells that were edited", () => {
    const mockEvent = {
      sample: "event",
      range: {
        columnEnd: 10,
        columnStart: 1,
        rowEnd: 2,
        rowStart: 2,
      },
    };

    onFormSubmit(mockEvent as any);

    expect(global.Logger.log).toHaveBeenCalledWith(
      JSON.stringify(mockEvent.range),
      {
        event: mockEvent,
      }
    );
  });
});
