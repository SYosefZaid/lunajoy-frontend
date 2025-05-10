import axios from "axios";
jest.mock("axios");
import { authService, dailyLogService } from "../../services/api";

describe("api service", () => {
  it("should call POST /auth/google", async () => {
    const postSpy = jest
      .spyOn(axios, "post")
      .mockResolvedValue({ data: { token: "t" } });
    const res = await authService.googleLogin("token");
    expect(postSpy).toHaveBeenCalledWith("/auth/google", { token: "token" });
    expect(res).toEqual({ token: "t" });
    postSpy.mockRestore();
  });
  it("should call POST /daily-logs", async () => {
    const postSpy = jest
      .spyOn(axios, "post")
      .mockResolvedValue({ data: { id: 1 } });
    const res = await dailyLogService.create({ mood: "happy" } as any);
    expect(postSpy).toHaveBeenCalledWith("/daily-logs", { mood: "happy" });
    expect(res).toEqual({ id: 1 });
    postSpy.mockRestore();
  });
  it("should call GET /daily-logs", async () => {
    const getSpy = jest
      .spyOn(axios, "get")
      .mockResolvedValue({ data: [{ id: 1 }] });
    const res = await dailyLogService.getAll();
    expect(getSpy).toHaveBeenCalledWith("/daily-logs?", undefined);
    expect(res).toEqual([{ id: 1 }]);
    getSpy.mockRestore();
  });
});
