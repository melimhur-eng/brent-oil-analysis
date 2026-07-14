import { Show, SimpleShowLayout, FunctionField } from 'react-admin';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

export const ChangePointShow = () => (
  <Show>
    <SimpleShowLayout>
      <Box sx={{ padding: '16px 0' }}>
        <FunctionField
          render={(record) => (
            <Card
              sx={{
                backgroundImage: record.direction === 'up'
                  ? 'linear-gradient(135deg, rgba(5, 150, 105, 0.08) 0%, rgba(5, 150, 105, 0.02) 100%)'
                  : 'linear-gradient(135deg, rgba(220, 38, 38, 0.08) 0%, rgba(220, 38, 38, 0.02) 100%)',
                border: `1px solid ${record.direction === 'up' ? 'rgba(5, 150, 105, 0.3)' : 'rgba(220, 38, 38, 0.3)'}`,
              }}
            >
              <CardContent sx={{ padding: '24px' }}>
                <Box display="flex" alignItems="center" gap={2} marginBottom={3}>
                  <Box
                    sx={{
                      backgroundColor: record.direction === 'up' ? 'rgba(5, 150, 105, 0.15)' : 'rgba(220, 38, 38, 0.15)',
                      borderRadius: '12px',
                      padding: '12px',
                      display: 'flex',
                    }}
                  >
                    {record.direction === 'up' ? (
                      <TrendingUpIcon sx={{ color: '#059669', fontSize: 32 }} />
                    ) : (
                      <TrendingDownIcon sx={{ color: '#dc2626', fontSize: 32 }} />
                    )}
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Structural break detected
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{record.change_date}</Typography>
                  </Box>
                </Box>

                <Chip
                  size="medium"
                  label={`${record.direction === 'up' ? 'Increase' : 'Decrease'} of ${Math.abs(record.pct_change).toFixed(1)}% in mean daily log-return`}
                  sx={{
                    backgroundColor: record.direction === 'up' ? 'rgba(5, 150, 105, 0.15)' : 'rgba(220, 38, 38, 0.15)',
                    color: record.direction === 'up' ? '#059669' : '#dc2626',
                    fontWeight: 600,
                    marginBottom: 3,
                  }}
                />

                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7 }}>
                  The Bayesian change point model (PyMC) identified a single most likely switch point (tau)
                  at {record.change_date}, where the posterior mean daily log-return shifted from{' '}
                  {record.before_mean.toExponential(3)} to {record.after_mean.toExponential(3)}. This marks a
                  change in the underlying volatility/trend regime of Brent oil prices.
                </Typography>
              </CardContent>
            </Card>
          )}
        />
      </Box>
    </SimpleShowLayout>
  </Show>
);
