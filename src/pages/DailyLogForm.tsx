import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Paper,
  Stack,
  Tooltip,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  FormControl,
  Modal,
  Fade,
  Backdrop,
  Grid,
  Divider,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dailyLogService } from "../services/api";
import { toast } from "react-toastify";

const sleepQualityOptions = ["Excellent", "Good", "Fair", "Poor"];

export function DailyLogForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    mood: 5,
    anxietyLevel: 5,
    sleepHours: 8,
    sleepQuality: "Good",
    sleepDisturbances: "",
    physicalActivityType: "",
    physicalActivityDuration: 0,
    socialInteractions: 0,
    stressLevel: 5,
    depressionSymptoms: "",
    anxietySymptoms: "",
  });
  const [openModal, setOpenModal] = useState(false);

  const mutation = useMutation({
    mutationFn: dailyLogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyLogs"] });
      setOpenModal(true);
    },
    onError: (error: Error) => {
      toast.error("Failed to submit log. Please try again.");
      console.error("Error creating log:", error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    navigate("/");
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4 },
            width: "100%",
            maxWidth: 700,
            bgcolor: "background.default",
            borderRadius: 3,
          }}
        >
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                New Daily Log
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Box>
            <Fade in={true} timeout={600}>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      Mood (1 = Very Sad, 10 = Very Happy)
                    </Typography>
                    <Tooltip
                      title="How was your mood today? 1 = very sad, 10 = very happy"
                      arrow
                    >
                      <Slider
                        value={formData.mood}
                        min={1}
                        max={10}
                        step={1}
                        marks
                        valueLabelDisplay="auto"
                        onChange={(_, value) =>
                          setFormData({ ...formData, mood: value as number })
                        }
                        sx={{ mb: 2 }}
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      Anxiety Level (1 = Not at all, 10 = Extremely Anxious)
                    </Typography>
                    <Tooltip
                      title="How anxious did you feel today? 1 = not at all, 10 = extremely anxious"
                      arrow
                    >
                      <Slider
                        value={formData.anxietyLevel}
                        min={1}
                        max={10}
                        step={1}
                        marks
                        valueLabelDisplay="auto"
                        onChange={(_, value) =>
                          setFormData({
                            ...formData,
                            anxietyLevel: value as number,
                          })
                        }
                        sx={{ mb: 2 }}
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      Stress Level (1 = Not at all, 10 = Extremely Stressed)
                    </Typography>
                    <Tooltip
                      title="How stressed did you feel today? 1 = not at all, 10 = extremely stressed"
                      arrow
                    >
                      <Slider
                        value={formData.stressLevel}
                        min={1}
                        max={10}
                        step={1}
                        marks
                        valueLabelDisplay="auto"
                        onChange={(_, value) =>
                          setFormData({
                            ...formData,
                            stressLevel: value as number,
                          })
                        }
                        sx={{ mb: 2 }}
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Tooltip title="How many hours did you sleep?" arrow>
                      <TextField
                        label="Sleep Hours"
                        type="number"
                        inputProps={{ min: 0, max: 24, step: 0.5 }}
                        value={formData.sleepHours}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({
                            ...formData,
                            sleepHours: Number(e.target.value),
                          })
                        }
                        fullWidth
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Sleep Quality</InputLabel>
                      <Select
                        value={formData.sleepQuality}
                        label="Sleep Quality"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sleepQuality: e.target.value,
                          })
                        }
                      >
                        {sleepQualityOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Sleep Disturbances"
                      value={formData.sleepDisturbances}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({
                          ...formData,
                          sleepDisturbances: e.target.value,
                        })
                      }
                      placeholder="e.g. Woke up frequently, nightmares, etc."
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Physical Activity Type"
                      value={formData.physicalActivityType}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({
                          ...formData,
                          physicalActivityType: e.target.value,
                        })
                      }
                      placeholder="e.g. Running, Yoga, Walking"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Physical Activity Duration (minutes)"
                      type="number"
                      inputProps={{ min: 0, max: 1440 }}
                      value={formData.physicalActivityDuration}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({
                          ...formData,
                          physicalActivityDuration: Number(e.target.value),
                        })
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Tooltip
                      title="How many social interactions did you have today?"
                      arrow
                    >
                      <TextField
                        label="Social Interactions"
                        type="number"
                        inputProps={{ min: 0, max: 50 }}
                        value={formData.socialInteractions}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({
                            ...formData,
                            socialInteractions: Number(e.target.value),
                          })
                        }
                        fullWidth
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} md={6} />
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Depression Symptoms (if any)"
                      value={formData.depressionSymptoms}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({
                          ...formData,
                          depressionSymptoms: e.target.value,
                        })
                      }
                      placeholder="Describe any symptoms of depression"
                      multiline
                      rows={2}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Anxiety Symptoms (if any)"
                      value={formData.anxietySymptoms}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({
                          ...formData,
                          anxietySymptoms: e.target.value,
                        })
                      }
                      placeholder="Describe any symptoms of anxiety"
                      multiline
                      rows={2}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={mutation.isPending}
                    >
                      Save Log
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Fade>
          </Stack>
        </Paper>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{ backdrop: { timeout: 500 } }}
        >
          <Fade in={openModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
                minWidth: 300,
                textAlign: "center",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Log Submitted!
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Your daily log has been saved successfully.
              </Typography>
              <Button variant="contained" onClick={handleCloseModal}>
                Go to Dashboard
              </Button>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </Container>
  );
}
