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

  it("should call the logger with the provided event", () => {
    const mockEvent = {
      sample: "event",
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
