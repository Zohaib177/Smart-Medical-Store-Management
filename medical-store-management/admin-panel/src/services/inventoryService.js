import api from './api';

export async function getInventory(params) { return (await api.get('/inventory', { params })).data; }
export async function getInventorySummary() { return (await api.get('/inventory/summary')).data?.data; }
export async function getInventoryHistory(params) { return (await api.get('/inventory/history', { params })).data; }
export async function getMedicineInventoryHistory(medicineId, params) { return (await api.get(`/inventory/medicines/${medicineId}/history`, { params })).data; }
export async function adjustMedicineStock(medicineId, data) { return (await api.post(`/inventory/medicines/${medicineId}/adjust`, data)).data; }
