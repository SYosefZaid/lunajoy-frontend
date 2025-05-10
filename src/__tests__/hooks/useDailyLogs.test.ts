import { renderHook } from "@testing-library/react";
import * as api from "../../services/api";
import { useDailyLogs } from "../../hooks/useDailyLogs";

jest.mock("../../services/api");

describe("useDailyLogs", () => {
  it("fetches daily logs", async () => {
    (api.getDailyLogs as jest.Mock).mockResolvedValue([{ id: 1 }]);
    const { result, waitForNextUpdate } = renderHook(() => useDailyLogs());
    await waitForNextUpdate();
    expect(result.current.dailyLogs).toEqual([{ id: 1 }]);
  });
});
