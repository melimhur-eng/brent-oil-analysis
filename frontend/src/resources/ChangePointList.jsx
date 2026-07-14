import { List, Datagrid, DateField, NumberField, FunctionField } from 'react-admin';
import { Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const DirectionField = () => (
  <FunctionField
    render={(record) => (
      <Chip
        size="small"
        icon={record.direction === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
        label={record.direction === 'up' ? 'Increase' : 'Decrease'}
        sx={{
          backgroundColor: record.direction === 'up' ? 'rgba(5, 150, 105, 0.12)' : 'rgba(220, 38, 38, 0.12)',
          color: record.direction === 'up' ? '#059669' : '#dc2626',
          fontWeight: 500,
          '& .MuiChip-icon': { color: 'inherit' },
        }}
      />
    )}
  />
);

export const ChangePointList = () => (
  <List sort={{ field: 'change_date', order: 'DESC' }} perPage={25}>
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <DateField source="change_date" label="Detected Date" />
      <NumberField source="before_mean" label="Mean log-return before" options={{ maximumFractionDigits: 6 }} />
      <NumberField source="after_mean" label="Mean log-return after" options={{ maximumFractionDigits: 6 }} />
      <NumberField source="pct_change" label="Change (%)" options={{ maximumFractionDigits: 1 }} />
      <DirectionField label="Direction" />
    </Datagrid>
  </List>
);
