import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dailyLogService } from "../services/api";
import type { DailyLog } from "../services/api";

export function useDailyLogs(startDate: string, endDate: string) {
  const queryClient = useQueryClient();

  const {
    data: logs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dailyLogs", startDate, endDate],
    queryFn: () => dailyLogService.getAll(startDate, endDate),
  });

  const createLogMutation = useMutation({
    mutationFn: (
      logData: Omit<DailyLog, "id" | "userId" | "createdAt" | "updatedAt">
    ) => dailyLogService.create(logData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyLogs"] });
    },
  });

  const updateLogMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DailyLog> }) =>
      dailyLogService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyLogs"] });
    },
  });

  const deleteLogMutation = useMutation({
    mutationFn: (id: number) => dailyLogService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyLogs"] });
    },
  });

  return {
    logs,
    isLoading,
    error,
    createLog: createLogMutation.mutate,
    updateLog: updateLogMutation.mutate,
    deleteLog: deleteLogMutation.mutate,
    isCreating: createLogMutation.isPending,
    isUpdating: updateLogMutation.isPending,
    isDeleting: deleteLogMutation.isPending,
  };
}
