import {
  List,
  Datagrid,
  TextField,
  DateField,
  TextInput,
  SelectInput,
  DateInput,
  FunctionField,
} from 'react-admin';
import { Chip } from '@mui/material';
import { CATEGORY_COLORS } from '../constants';

const filters = [
  <TextInput key="q" source="q" label="Search" alwaysOn resettable />,
  <SelectInput
    key="category"
    source="category"
    label="Category"
    choices={[
      { id: 'Geopolitical', name: 'Geopolitical' },
      { id: 'Economic', name: 'Economic' },
      { id: 'OPEC', name: 'OPEC' },
    ]}
  />,
  <DateInput key="date_gte" source="date_gte" label="From Date" />,
  <DateInput key="date_lte" source="date_lte" label="To Date" />,
];

const CategoryField = () => (
  <FunctionField
    render={(record) => (
      <Chip
        size="small"
        label={record.category}
        sx={{
          backgroundColor: `${CATEGORY_COLORS[record.category]}22`,
          color: CATEGORY_COLORS[record.category],
          fontWeight: 500,
        }}
      />
    )}
  />
);

export const EventList = () => (
  <List filters={filters} sort={{ field: 'date', order: 'DESC' }} perPage={25}>
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <DateField source="date" label="Date" />
      <TextField source="event" label="Event" />
      <CategoryField label="Category" />
      <TextField source="description" label="Description" />
    </Datagrid>
  </List>
);
