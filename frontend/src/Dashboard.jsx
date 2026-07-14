import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TimelineIcon from '@mui/icons-material/Timeline';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { PriceChart } from './components/PriceChart';
import { EventImpactDialog } from './components/EventImpactDialog';
import { getPrices, getEvents, getChangepoints, getSummary } from './api';
import { CATEGORY_COLORS } from './constants';

const CATEGORIES = ['Geopolitical', 'Economic', 'OPEC'];

// eslint-disable-next-line no-unused-vars -- Icon is used in the JSX below; this config lacks JSX-aware unused-vars detection
const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
  <Card sx={{ height: '100%', flex: '1 1 220px', minWidth: '220px' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}15`,
            borderRadius: '12px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon sx={{ color, fontSize: 28 }} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

function resampleFor(startDate, endDate) {
  if (!startDate || !endDate) return 'none';
  const days = (new Date(endDate) - new Date(startDate)) / 86400000;
  if (days > 3650) return 'monthly';
  if (days > 730) return 'weekly';
  return 'none';
}

export const Dashboard = () => {
  const [fullRange, setFullRange] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pendingStart, setPendingStart] = useState('');
  const [pendingEnd, setPendingEnd] = useState('');
  const [visibleCategories, setVisibleCategories] = useState(CATEGORIES);
  const [prices, setPrices] = useState([]);
  const [events, setEvents] = useState([]);
  const [changepoints, setChangepoints] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    getSummary().then((s) => {
      setFullRange({ start: s.start_date, end: s.end_date });
      setStartDate(s.start_date);
      setEndDate(s.end_date);
      setPendingStart(s.start_date);
      setPendingEnd(s.end_date);
    });
    getChangepoints().then(setChangepoints);
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading flag for the fetch this effect triggers
    setLoadingPrices(true);
    const resample = resampleFor(startDate, endDate);
    Promise.all([
      getPrices({ start: startDate, end: endDate, resample }),
      getEvents({ start: startDate, end: endDate }),
      getSummary({ start: startDate, end: endDate }),
    ]).then(([priceData, eventData, summaryData]) => {
      setPrices(priceData);
      setEvents(eventData);
      setSummary(summaryData);
      setLoadingPrices(false);
    });
  }, [startDate, endDate]);

  const filteredEvents = useMemo(
    () => events.filter((e) => visibleCategories.includes(e.category)),
    [events, visibleCategories]
  );

  const handleApplyRange = () => {
    setStartDate(pendingStart);
    setEndDate(pendingEnd);
  };

  const handleReset = () => {
    if (!fullRange) return;
    setPendingStart(fullRange.start);
    setPendingEnd(fullRange.end);
    setStartDate(fullRange.start);
    setEndDate(fullRange.end);
  };

  const handleBrushRangeSelect = (s, e) => {
    if (s && e) {
      setPendingStart(s);
      setPendingEnd(e);
      setStartDate(s);
      setEndDate(e);
    }
  };

  return (
    <Box sx={{ padding: '24px' }}>
      <Box sx={{ marginBottom: '24px' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, marginBottom: '8px' }}>
          Brent Oil Price Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Historical Brent crude prices with detected structural breaks and major market events
        </Typography>
      </Box>

      <Card sx={{ marginBottom: '24px' }}>
        <CardContent sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            label="From"
            type="date"
            size="small"
            value={pendingStart}
            onChange={(e) => setPendingStart(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="To"
            type="date"
            size="small"
            value={pendingEnd}
            onChange={(e) => setPendingEnd(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Button variant="contained" onClick={handleApplyRange}>Apply</Button>
          <Button variant="text" onClick={handleReset}>Reset to full range</Button>

          <Box sx={{ flexGrow: 1 }} />

          <ToggleButtonGroup value={visibleCategories} onChange={(e, next) => setVisibleCategories(next)} size="small">
            {CATEGORIES.map((cat) => (
              <ToggleButton
                key={cat}
                value={cat}
                sx={{
                  textTransform: 'none',
                  '&.Mui-selected': {
                    backgroundColor: `${CATEGORY_COLORS[cat]}22`,
                    color: CATEGORY_COLORS[cat],
                  },
                }}
              >
                {cat}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '32px' }}>
        <StatCard
          title="Latest Price"
          value={summary ? `$${summary.end_price}` : '—'}
          subtitle="USD per barrel"
          icon={ShowChartIcon}
          color="#6366f1"
        />
        <StatCard
          title="Change over range"
          value={summary ? `${summary.pct_change >= 0 ? '+' : ''}${summary.pct_change}%` : '—'}
          subtitle={summary ? `${summary.start_date} → ${summary.end_date}` : ''}
          icon={summary && summary.pct_change >= 0 ? TrendingUpIcon : TrendingDownIcon}
          color={summary && summary.pct_change >= 0 ? '#22c55e' : '#ef4444'}
        />
        <StatCard
          title="Annualized Volatility"
          value={summary ? `${summary.annualized_volatility_pct}%` : '—'}
          subtitle="Based on daily log returns"
          icon={TimelineIcon}
          color="#8b5cf6"
        />
        <StatCard
          title="Change Points Detected"
          value={changepoints.length}
          subtitle={changepoints[0] ? `Most recent: ${changepoints[0].change_date}` : ''}
          icon={TimelineIcon}
          color="#f59e0b"
        />
      </Box>

      <Card sx={{ marginBottom: '24px' }}>
        <CardContent sx={{ padding: '24px' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '16px' }}>
            Price History
          </Typography>
          <Box sx={{ width: '100%', height: 420 }}>
            <PriceChart
              data={prices}
              events={filteredEvents}
              changepoints={changepoints}
              loading={loadingPrices}
              height={420}
              onRangeSelect={handleBrushRangeSelect}
            />
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, marginBottom: '16px' }}>
            Events in range ({filteredEvents.length})
          </Typography>
          <List dense>
            {filteredEvents.map((event) => (
              <ListItemButton
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                sx={{ borderRadius: '8px', marginBottom: '4px' }}
              >
                <ListItemText primary={event.event} secondary={event.date} />
                <Chip
                  size="small"
                  label={event.category}
                  sx={{
                    backgroundColor: `${CATEGORY_COLORS[event.category]}22`,
                    color: CATEGORY_COLORS[event.category],
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            ))}
            {filteredEvents.length === 0 && (
              <Typography color="text.secondary">No events in this range / category selection</Typography>
            )}
          </List>
        </CardContent>
      </Card>

      <EventImpactDialog event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </Box>
  );
};
