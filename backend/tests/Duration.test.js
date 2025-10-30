import { calculateDuration } from "../src/utils/CalculateDuration.js";

test("calculates duration in minutes correctly", () => {
  const result = calculateDuration(
    "2024-01-01T10:00:00Z",
    "2024-01-01T11:30:00Z"
  );
  expect(result).toBe(90);
});
