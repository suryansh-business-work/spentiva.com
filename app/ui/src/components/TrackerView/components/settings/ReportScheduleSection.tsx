import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Skeleton,
  Paper,
  useTheme,
  CircularProgress,
} from '@mui/material';
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';
import { endpoints } from '../../../../config/api';
import { getRequest, postRequest, putRequest, deleteRequest } from '../../../../utils/http';
import { parseResponseData } from '../../../../utils/response-parser';

interface ReportScheduleSectionProps {
  trackerId: string;
  trackerName: string;
}

interface Schedule {
  _id: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  hour: number;
  enabled: boolean;
  lastSentAt?: string;
  nextRunAt?: string;
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ReportScheduleSection: React.FC<ReportScheduleSectionProps> = ({
  trackerId,
  trackerName,
}) => {
  const theme = useTheme();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; severity: 'success' | 'error' } | null>(
    null
  );

  // Form state
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [hour, setHour] = useState(9);

  const loadSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getRequest(endpoints.reportSchedule.byTracker(trackerId));
      const data = parseResponseData<{ schedule: Schedule | null }>(res, { schedule: null });
      const s = data?.schedule ?? null;
      setSchedule(s);
      if (s) {
        setFrequency(s.frequency);
        setDayOfWeek(s.dayOfWeek ?? 1);
        setDayOfMonth(s.dayOfMonth ?? 1);
        setHour(s.hour);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [trackerId]);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const payload = {
        trackerId,
        trackerName,
        frequency,
        ...(frequency === 'weekly' && { dayOfWeek }),
        ...(frequency === 'monthly' && { dayOfMonth }),
        hour,
      };

      if (schedule) {
        await putRequest(endpoints.reportSchedule.update(schedule._id), payload);
      } else {
        await postRequest(endpoints.reportSchedule.create, payload);
      }
      setFeedback({ msg: schedule ? 'Schedule updated' : 'Schedule created', severity: 'success' });
      await loadSchedule();
    } catch {
      setFeedback({ msg: 'Failed to save schedule', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (enabled: boolean) => {
    if (!schedule) return;
    setSaving(true);
    try {
      await putRequest(endpoints.reportSchedule.update(schedule._id), { enabled });
      await loadSchedule();
    } catch {
      setFeedback({ msg: 'Failed to toggle schedule', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!schedule) return;
    setSaving(true);
    try {
      await deleteRequest(endpoints.reportSchedule.delete(schedule._id));
      setSchedule(null);
      setFeedback({ msg: 'Schedule removed', severity: 'success' });
    } catch {
      setFeedback({ msg: 'Failed to delete schedule', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />;

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <ScheduleSendIcon color="primary" />
        <Typography variant="subtitle1" fontWeight={600}>
          Scheduled Reports
        </Typography>
        {schedule && (
          <Switch
            size="small"
            checked={schedule.enabled}
            onChange={(_, v) => handleToggle(v)}
            sx={{ ml: 'auto' }}
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Frequency</InputLabel>
          <Select
            value={frequency}
            label="Frequency"
            onChange={e => setFrequency(e.target.value as any)}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>

        {frequency === 'weekly' && (
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Day</InputLabel>
            <Select
              value={dayOfWeek}
              label="Day"
              onChange={e => setDayOfWeek(Number(e.target.value))}
            >
              {DAYS_OF_WEEK.map((d, i) => (
                <MenuItem key={i} value={i}>
                  {d}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {frequency === 'monthly' && (
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Day</InputLabel>
            <Select
              value={dayOfMonth}
              label="Day"
              onChange={e => setDayOfMonth(Number(e.target.value))}
            >
              {Array.from({ length: 28 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Time</InputLabel>
          <Select value={hour} label="Time" onChange={e => setHour(Number(e.target.value))}>
            {Array.from({ length: 24 }, (_, i) => (
              <MenuItem key={i} value={i}>{`${i.toString().padStart(2, '0')}:00`}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {schedule ? 'Update' : 'Create'} Schedule
        </Button>
        {schedule && (
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={handleDelete}
            disabled={saving}
          >
            Remove
          </Button>
        )}
      </Box>

      {schedule?.nextRunAt && (
        <Typography
          variant="caption"
          sx={{ display: 'block', mt: 1, color: theme.palette.text.secondary }}
        >
          Next report: {new Date(schedule.nextRunAt).toLocaleString()}
        </Typography>
      )}

      {feedback && (
        <Alert severity={feedback.severity} sx={{ mt: 1.5 }} onClose={() => setFeedback(null)}>
          {feedback.msg}
        </Alert>
      )}
    </Paper>
  );
};

export default ReportScheduleSection;
