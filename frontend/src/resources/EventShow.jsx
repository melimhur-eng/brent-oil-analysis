import { Show, SimpleShowLayout, FunctionField } from 'react-admin';
import { Box, Card, CardContent, Typography, Chip, CircularProgress } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { useEffect, useState } from 'react';
import { getEventImpact } from '../api';
import { CATEGORY_COLORS } from '../constants';

const ImpactPanel = ({ eventId }) => {
  const [impact, setImpact] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEventImpact(eventId, 30)
      .then(setImpact)
      .catch((err) => setError(err.message));
  }, [eventId]);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!impact) return <CircularProgress size={24} />;

  const up = impact.pct_change >= 0;

  return (
    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginTop: 3 }}>
      <Box>
        <Typography variant="body2" color="text.secondary">Avg price, 30d before</Typography>
        <Typography variant="h6">${impact.before_avg_price}</Typography>
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">Avg price, 30d after</Typography>
        <Typography variant="h6">${impact.after_avg_price}</Typography>
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">Change</Typography>
        <Typography variant="h6" sx={{ color: up ? '#059669' : '#dc2626' }}>
          {up ? '+' : ''}{impact.pct_change}%
        </Typography>
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">Volatility before → after</Typography>
        <Typography variant="h6">
          {impact.before_volatility ?? '—'} → {impact.after_volatility ?? '—'}
        </Typography>
      </Box>
    </Box>
  );
};

export const EventShow = () => (
  <Show>
    <SimpleShowLayout>
      <Box sx={{ padding: '16px 0' }}>
        <FunctionField
          render={(record) => (
            <Card
              sx={{
                backgroundImage: `linear-gradient(135deg, ${CATEGORY_COLORS[record.category]}14 0%, ${CATEGORY_COLORS[record.category]}05 100%)`,
                border: `1px solid ${CATEGORY_COLORS[record.category]}4d`,
              }}
            >
              <CardContent sx={{ padding: '24px' }}>
                <Box display="flex" alignItems="center" gap={2} marginBottom={2}>
                  <Box
                    sx={{
                      backgroundColor: `${CATEGORY_COLORS[record.category]}26`,
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                    }}
                  >
                    <EventIcon sx={{ color: CATEGORY_COLORS[record.category], fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>{record.event}</Typography>
                    <Typography variant="body2" color="text.secondary">{record.date}</Typography>
                  </Box>
                </Box>

                <Chip
                  size="medium"
                  label={record.category}
                  sx={{
                    backgroundColor: `${CATEGORY_COLORS[record.category]}26`,
                    color: CATEGORY_COLORS[record.category],
                    fontWeight: 600,
                    marginBottom: 2,
                  }}
                />

                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7 }}>
                  {record.description}
                </Typography>

                <Typography variant="subtitle2" sx={{ marginTop: 3, fontWeight: 600 }}>
                  Price impact (±30 days)
                </Typography>
                <ImpactPanel eventId={record.id} />
              </CardContent>
            </Card>
          )}
        />
      </Box>
    </SimpleShowLayout>
  </Show>
);
