import { Admin, Resource } from 'react-admin';
import TimelineIcon from '@mui/icons-material/Timeline';
import EventIcon from '@mui/icons-material/Event';

import { dataProvider } from './dataProvider';
import { oilDashboardTheme } from './theme';
import { Dashboard } from './Dashboard';
import { EventList } from './resources/EventList';
import { EventShow } from './resources/EventShow';
import { ChangePointList } from './resources/ChangePointList';
import { ChangePointShow } from './resources/ChangePointShow';

function App() {
  return (
    <Admin
      dataProvider={dataProvider}
      dashboard={Dashboard}
      theme={oilDashboardTheme}
      title="Brent Oil Price Dashboard"
    >
      <Resource
        name="events"
        options={{ label: 'Events' }}
        list={EventList}
        show={EventShow}
        icon={EventIcon}
      />
      <Resource
        name="change-points"
        options={{ label: 'Change Points' }}
        list={ChangePointList}
        show={ChangePointShow}
        icon={TimelineIcon}
      />
    </Admin>
  );
}

export default App;
