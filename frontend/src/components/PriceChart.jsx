import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
} from 'recharts';
import { Box, CircularProgress, Typography } from '@mui/material';
import { CATEGORY_COLORS, CHANGE_POINT_COLOR } from '../constants';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          border: '1px solid rgba(79, 70, 229, 0.2)',
          borderRadius: '8px',
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="body2" sx={{ color: '#64748b', marginBottom: '4px' }}>
          {label}
        </Typography>
        <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600 }}>
          ${payload[0].value?.toFixed(2)}
        </Typography>
      </Box>
    );
  }
  return null;
};

export const PriceChart = ({ data, events = [], changepoints = [], loading, height = 420, onRangeSelect }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={height}>
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Box>
    );
  }

  if (!data.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={height}>
        <Typography color="text.secondary">No price data in this range</Typography>
      </Box>
    );
  }

  const handleBrushChange = (range) => {
    if (!onRangeSelect || range.startIndex == null || range.endIndex == null) return;
    onRangeSelect(data[range.startIndex]?.date, data[range.endIndex]?.date);
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.3)" />
        <XAxis
          dataKey="date"
          stroke="#64748b"
          tick={{ fill: '#64748b', fontSize: 11 }}
          minTickGap={60}
        />
        <YAxis
          domain={['dataMin - 5', 'dataMax + 10']}
          stroke="#64748b"
          tick={{ fill: '#64748b', fontSize: 11 }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip content={<CustomTooltip />} />

        {events.map((event) => (
          <ReferenceLine
            key={`event-${event.id}`}
            x={event.date}
            stroke={CATEGORY_COLORS[event.category] || '#94a3b8'}
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
        ))}

        {changepoints.map((cp) => (
          <ReferenceLine
            key={`cp-${cp.id}`}
            x={cp.change_date}
            stroke={CHANGE_POINT_COLOR}
            strokeWidth={2.5}
            label={{ value: 'Change Point', position: 'top', fontSize: 10, fill: CHANGE_POINT_COLOR }}
          />
        ))}

        <Line
          type="monotone"
          dataKey="price"
          name="Oil Price (USD/barrel)"
          stroke="#6366f1"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
          activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
        />

        <Brush
          dataKey="date"
          height={24}
          stroke="#6366f1"
          travellerWidth={8}
          onChange={handleBrushChange}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};
