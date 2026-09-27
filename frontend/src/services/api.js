import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const ACCESS_KEY = 'invisibleaid_access_token';
const REFRESH_KEY = 'invisibleaid_refresh_token';
const USER_KEY = 'invisibleaid_user';

export const tokenStorage = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  getUser: () => {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; }
  },
  save: ({ access, refresh, user }) => {
    if (access) localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear: () => [ACCESS_KEY, REFRESH_KEY, USER_KEY].forEach(key => localStorage.removeItem(key)),
};

const client = axios.create({ baseURL: API_BASE_URL });
let refreshRequest = null;

client.interceptors.request.use(config => {
  const token = tokenStorage.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config;
    if (error.response?.status !== 401 || original?._retry || original?.url?.includes('/auth/token/refresh/')) {
      return Promise.reject(error);
    }
    const refresh = tokenStorage.getRefresh();
    if (!refresh) return Promise.reject(error);
    original._retry = true;
    refreshRequest ||= client.post('/auth/token/refresh/', { refresh }).then(({ data }) => {
      tokenStorage.save({ access: data.access });
      return data.access;
    }).catch(refreshError => {
      tokenStorage.clear();
      window.dispatchEvent(new Event('invisibleaid:unauthorized'));
      throw refreshError;
    }).finally(() => { refreshRequest = null; });
    try {
      const access = await refreshRequest;
      original.headers.Authorization = `Bearer ${access}`;
      return client(original);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);

const request = async promise => {
  try { return (await promise).data; } catch (error) {
    const detail = error.response?.data?.detail || error.response?.data?.error;
    const message = typeof detail === 'string' ? detail : 'Unable to complete the request.';
    const normalized = new Error(message);
    normalized.status = error.response?.status;
    normalized.data = error.response?.data;
    throw normalized;
  }
};

export const authAPI = {
  login: (email, password) => request(client.post('/auth/login/', { email, password })),
  register: data => request(client.post('/auth/register/', data)),
  getProfile: () => request(client.get('/auth/profile/')),
  changePassword: data => request(client.post('/auth/change-password/', data)),
  logout: refresh => request(client.post('/auth/logout/', { refresh })),
};

const unwrapPaginated = data => Array.isArray(data) ? data : (data?.results ?? []);

export const beneficiaryAPI = {
  list: params => request(client.get('/beneficiaries/', { params })).then(unwrapPaginated),
  getById: id => request(client.get(`/beneficiaries/${id}/`)),
  create: data => request(client.post('/beneficiaries/', data)),
  update: (id, data) => request(client.patch(`/beneficiaries/${id}/`, data)),
  remove: id => request(client.delete(`/beneficiaries/${id}/`)),
};

export const assessmentAPI = {
  list: () => request(client.get('/assessments/assessments/')).then(unwrapPaginated),
  getResult: id => request(client.get(`/assessments/assessments/${id}/`)),
  run: beneficiaryId => request(client.post(`/assessments/${beneficiaryId}/assess/`)),
};

export const ruleAPI = {
  list: () => request(client.get('/assessments/rules/')).then(unwrapPaginated),
  categories: () => request(client.get('/assessments/rule-categories/')).then(unwrapPaginated),
  create: data => request(client.post('/assessments/rules/', data)),
  update: (id, data) => request(client.patch(`/assessments/rules/${id}/`, data)),
  toggleActive: (id, is_active) => request(client.patch(`/assessments/rules/${id}/`, { is_active })),
};

export const schemeAPI = {
  list: () => request(client.get('/schemes/schemes/')).then(unwrapPaginated),
  getById: id => request(client.get(`/schemes/schemes/${id}/`)),
  create: data => request(client.post('/schemes/schemes/', data)),
  update: (id, data) => request(client.patch(`/schemes/schemes/${id}/`, data)),
  remove: id => request(client.delete(`/schemes/schemes/${id}/`)),
};

export const recommendationAPI = {
  generate: beneficiaryId => request(client.post(`/schemes/beneficiaries/${beneficiaryId}/recommend/`)),
  listForBeneficiary: beneficiaryId => request(client.get('/schemes/recommendations/', { params: { beneficiary: beneficiaryId } })).then(unwrapPaginated),
  list: () => request(client.get('/schemes/recommendations/')).then(unwrapPaginated),
};

export const documentAPI = {
  list: async beneficiaryId => {
    const documents = await request(client.get('/documents/')).then(unwrapPaginated);
    return beneficiaryId ? documents.filter(document => String(document.beneficiary) === String(beneficiaryId)) : documents;
  },
  upload: data => request(client.post('/documents/', data, { headers: { 'Content-Type': 'multipart/form-data' } })),
  verify: id => request(client.post(`/documents/${id}/verify/`)),
  reject: (id, rejection_reason) => request(client.post(`/documents/${id}/reject/`, { rejection_reason })),
};

export const applicationAPI = {
  list: () => request(client.get('/schemes/applications/')).then(unwrapPaginated),
  getById: id => request(client.get(`/schemes/applications/${id}/`)),
  create: recommendation => request(client.post('/schemes/applications/', { recommendation })),
  updateStatus: (id, status, notes) => request(client.patch(`/schemes/applications/${id}/status/`, { status, notes })),
};

export const reportAPI = {
  getDashboardStats: () => request(client.get('/reports/dashboard/')),
};

export const organizationAPI = {
  list: () => request(client.get('/organizations/')).then(unwrapPaginated),
  approve: id => request(client.post(`/organizations/${id}/approve/`)),
  reject: id => request(client.post(`/organizations/${id}/reject/`)),
  suspend: id => request(client.post(`/organizations/${id}/suspend/`)),
};

export const auditAPI = {
  list: () => request(client.get('/audit/')).then(unwrapPaginated),
};

export default client;
