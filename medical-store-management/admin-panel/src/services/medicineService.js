import api from './api';
export async function getMedicines(params) { return (await api.get('/medicines', { params })).data; }
export async function getMedicineOptions() { return (await api.get('/medicines/options')).data?.data; }
export async function getMedicineById(id) { return (await api.get(`/medicines/${id}`)).data?.data?.medicine; }
export async function createMedicine(data) { return (await api.post('/medicines', data)).data; }
export async function updateMedicine(id, data) { return (await api.put(`/medicines/${id}`, data)).data; }
export async function updateMedicineStatus(id, status) { return (await api.patch(`/medicines/${id}/status`, { status })).data; }
export async function deleteMedicine(id) { return (await api.delete(`/medicines/${id}`)).data; }
