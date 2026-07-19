import api from './api';

export async function getCompanies(params) { return (await api.get('/companies', { params })).data; }
export async function getCompanyById(id) { return (await api.get(`/companies/${id}`)).data?.data?.company; }
export async function createCompany(data) { return (await api.post('/companies', data)).data; }
export async function updateCompany(id, data) { return (await api.put(`/companies/${id}`, data)).data; }
export async function updateCompanyStatus(id, status) { return (await api.patch(`/companies/${id}/status`, { status })).data; }
export async function deleteCompany(id) { return (await api.delete(`/companies/${id}`)).data; }
