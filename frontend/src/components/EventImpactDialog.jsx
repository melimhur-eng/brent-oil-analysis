import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Chip,
  CircularProgress,
} from '@mui/material';
import { getEventImpact } from '../api';
import { CATEGORY_COLORS } from '../constants';

export const EventImpactDialog = ({ event, onClose }) => {
  const [impact, setImpact] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!event) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset state for the fetch this effect triggers
    setImpact(null);
    setError(null);
    getEventImpact(event.id, 30)
      .then(setImpact)
      .catch((err) => setError(err.message));
  }, [event]);

  return (
    <Dialog open={Boolean(event)} onClose={onClose} maxWidth="sm" fullWidth>
      {event && (
        <>
          <DialogTitle>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{event.event}</Typography>
            <Typography variant="body2" color="text.secondary">{event.date}</Typography>
            <Chip
              size="small"
              label={event.category}
              sx={{
                marginTop: 1,
                backgroundColor: `${CATEGORY_COLORS[event.category]}22`,
                color: CATEGORY_COLORS[event.category],
                fontWeight: 500,
              }}
            />
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ color: '#475569', marginBottom: 3 }}>
              {event.description}
            </Typography>

            {error && <Typography color="error">{error}</Typography>}
            {!impact && !error && (
              <Box display="flex" justifyContent="center" padding={3}>
                <CircularProgress size={28} />
              </Box>
            )}
            {impact && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 2 }}>
                  Price impact (±{impact.window_days} days)
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Avg price before</Typography>
                    <Typography variant="h6">${impact.before_avg_price}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Avg price after</Typography>
                    <Typography variant="h6">${impact.after_avg_price}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Change</Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: impact.pct_change >= 0 ? '#059669' : '#dc2626' }}
                    >
                      {impact.pct_change >= 0 ? '+' : ''}{impact.pct_change}%
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Volatility before → after</Typography>
                    <Typography variant="h6">
                      {impact.before_volatility ?? '—'} → {impact.after_volatility ?? '—'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};
