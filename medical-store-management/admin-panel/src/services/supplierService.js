import api from './api';
export async function getSuppliers(params) { return (await api.get('/suppliers', { params })).data; }
export async function getSupplierOptions() { return (await api.get('/suppliers/options')).data?.data; }
export async function getSupplierById(id) { return (await api.get(`/suppliers/${id}`)).data?.data?.supplier; }
export async function createSupplier(data) { return (await api.post('/suppliers', data)).data; }
export async function updateSupplier(id, data) { return (await api.put(`/suppliers/${id}`, data)).data; }
export async function updateSupplierStatus(id, status) { return (await api.patch(`/suppliers/${id}/status`, { status })).data; }
export async function deleteSupplier(id) { return (await api.delete(`/suppliers/${id}`)).data; }
