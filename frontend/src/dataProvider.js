import { getEvents, getChangepoints } from './api';

function applySearch(data, q) {
  if (!q) return data;
  const needle = q.toLowerCase();
  return data.filter(
    (row) =>
      row.event?.toLowerCase().includes(needle) ||
      row.description?.toLowerCase().includes(needle)
  );
}

function sortAndPaginate(data, { sort, pagination }) {
  const { field, order } = sort || {};
  let sorted = [...data];
  if (field) {
    sorted.sort((a, b) => {
      if (a[field] < b[field]) return order === 'ASC' ? -1 : 1;
      if (a[field] > b[field]) return order === 'ASC' ? 1 : -1;
      return 0;
    });
  }
  const total = sorted.length;
  if (pagination) {
    const { page, perPage } = pagination;
    const start = (page - 1) * perPage;
    sorted = sorted.slice(start, start + perPage);
  }
  return { data: sorted, total };
}

async function fetchResource(resource, filter) {
  if (resource === 'events') {
    const data = await getEvents({
      category: filter.category,
      start: filter.date_gte,
      end: filter.date_lte,
    });
    return applySearch(data, filter.q);
  }
  if (resource === 'change-points') {
    return getChangepoints();
  }
  throw new Error(`Unknown resource: ${resource}`);
}

export const dataProvider = {
  getList: async (resource, params) => {
    const data = await fetchResource(resource, params.filter || {});
    return sortAndPaginate(data, params);
  },
  getOne: async (resource, params) => {
    const data = await fetchResource(resource, {});
    const record = data.find((row) => String(row.id) === String(params.id));
    if (!record) throw new Error(`${resource} ${params.id} not found`);
    return { data: record };
  },
  getMany: async (resource, params) => {
    const data = await fetchResource(resource, {});
    return { data: data.filter((row) => params.ids.map(String).includes(String(row.id))) };
  },
  getManyReference: async () => ({ data: [], total: 0 }),
  create: async () => {
    throw new Error('This dashboard is read-only');
  },
  update: async () => {
    throw new Error('This dashboard is read-only');
  },
  updateMany: async () => {
    throw new Error('This dashboard is read-only');
  },
  delete: async () => {
    throw new Error('This dashboard is read-only');
  },
  deleteMany: async () => {
    throw new Error('This dashboard is read-only');
  },
};
