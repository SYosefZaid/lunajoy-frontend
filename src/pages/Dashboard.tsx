import { Box, Container, Grid, Typography, Paper, Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { dailyLogService } from "../services/api";
import type { DailyLog } from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect } from "react";
import { io } from "socket.io-client";
import MoodIcon from "@mui/icons-material/Mood";
import HotelIcon from "@mui/icons-material/Hotel";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import GroupsIcon from "@mui/icons-material/Groups";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

export function Dashboard() {
  const {
    data: logs,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dailyLogs"],
    queryFn: () => dailyLogService.getAll(),
  });

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL.replace(/\/api$/, ""));
    socket.on("new-daily-log", () => {
      refetch();
    });
    return () => {
      socket.disconnect();
    };
  }, [refetch]);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error loading logs</Typography>;
  }

  // Prepare data for charts (sort by date ascending)
  const chartData = logs
    ? [...logs]
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        .map((log) => ({
          date: new Date(log.createdAt).toLocaleDateString(),
          mood: log.mood,
          sleep: log.sleepHours,
          anxiety: log.anxietyLevel,
        }))
    : [];

  // Calculate today's average mood
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaysLogs =
    logs?.filter((log) => {
      const logDate = new Date(log.createdAt);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    }) || [];
  const todaysAverageMood =
    todaysLogs.length > 0
      ? todaysLogs.reduce((acc, log) => acc + log.mood, 0) / todaysLogs.length
      : null;

  function getMoodStatus(avg: number | null) {
    if (avg === null)
      return {
        label: "No logs",
        icon: <SentimentNeutralIcon color="disabled" />,
        color: "text.secondary",
      };
    if (avg >= 8)
      return {
        label: "Very Happy",
        icon: <SentimentVerySatisfiedIcon color="success" />,
        color: "success.main",
      };
    if (avg >= 6)
      return {
        label: "Happy",
        icon: <SentimentSatisfiedIcon color="primary" />,
        color: "primary.main",
      };
    if (avg >= 4)
      return {
        label: "Neutral",
        icon: <SentimentNeutralIcon color="warning" />,
        color: "warning.main",
      };
    if (avg >= 2)
      return {
        label: "Sad",
        icon: <SentimentDissatisfiedIcon color="error" />,
        color: "error.main",
      };
    return {
      label: "Very Sad",
      icon: <SentimentVeryDissatisfiedIcon color="error" />,
      color: "error.dark",
    };
  }
  const moodStatus = getMoodStatus(todaysAverageMood);

  return (
    <Container maxWidth="xl">
      <Stack spacing={4}>
        <Typography variant="h3">Dashboard</Typography>

        {/* Charts Section */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Trends (Mood, Sleep, Anxiety)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#1976d2"
                name="Mood"
              />
              <Line
                type="monotone"
                dataKey="sleep"
                stroke="#43a047"
                name="Sleep Hours"
              />
              <Line
                type="monotone"
                dataKey="anxiety"
                stroke="#e53935"
                name="Anxiety Level"
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        <Grid container>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}
            >
              {moodStatus.icon}
              <Box>
                <Typography variant="h5" gutterBottom fontWeight={700}>
                  Today's Mood
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ color: moodStatus.color, fontWeight: 700 }}
                >
                  {moodStatus.label}
                </Typography>
                {todaysAverageMood !== null && (
                  <Typography variant="body2" color="text.secondary">
                    (Avg: {todaysAverageMood.toFixed(1)})
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box>
          <Typography variant="h4" gutterBottom>
            Recent Logs
          </Typography>
          <Stack spacing={2}>
            {logs?.slice(0, 5).map((log) => (
              <Paper key={log.id} elevation={1} sx={{ p: 3, borderRadius: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Typography fontWeight={700} color="primary.main">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={6}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <MoodIcon color="primary" />
                          <Typography fontWeight={500}>Mood:</Typography>
                          <Typography color="primary.main">
                            {log.mood}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <PsychologyIcon color="secondary" />
                          <Typography fontWeight={500}>Anxiety:</Typography>
                          <Typography color="secondary.main">
                            {log.anxietyLevel}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <SentimentDissatisfiedIcon color="error" />
                          <Typography fontWeight={500}>Stress:</Typography>
                          <Typography color="error.main">
                            {log.stressLevel}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <HotelIcon color="info" />
                          <Typography fontWeight={500}>Sleep:</Typography>
                          <Typography>
                            {log.sleepHours} hrs, {log.sleepQuality}
                          </Typography>
                        </Box>
                        {log.sleepDisturbances && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <HotelIcon color="disabled" />
                            <Typography fontWeight={500}>
                              Disturbances:
                            </Typography>
                            <Typography>{log.sleepDisturbances}</Typography>
                          </Box>
                        )}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <FitnessCenterIcon color="success" />
                          <Typography fontWeight={500}>Activity:</Typography>
                          <Typography>
                            {log.physicalActivityType} (
                            {log.physicalActivityDuration} min)
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <GroupsIcon color="action" />
                          <Typography fontWeight={500}>Social:</Typography>
                          <Typography>{log.socialInteractions}</Typography>
                        </Box>
                        {log.depressionSymptoms && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <PsychologyIcon color="warning" />
                            <Typography fontWeight={500}>
                              Depression:
                            </Typography>
                            <Typography>{log.depressionSymptoms}</Typography>
                          </Box>
                        )}
                        {log.anxietySymptoms && (
                          <Box display="flex" alignItems="center" gap={1}>
                            <PsychologyIcon color="info" />
                            <Typography fontWeight={500}>
                              Anxiety Symptoms:
                            </Typography>
                            <Typography>{log.anxietySymptoms}</Typography>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
