import api from './api';

export async function getCategories(params) {
  const response = await api.get('/categories', { params });
  return response.data;
}

export async function getCategoryById(id) {
  const response = await api.get(`/categories/${id}`);
  return response.data?.data?.category;
}

export async function createCategory(data) {
  const response = await api.post('/categories', data);
  return response.data;
}

export async function updateCategory(id, data) {
  const response = await api.put(`/categories/${id}`, data);
  return response.data;
}

export async function updateCategoryStatus(id, status) {
  const response = await api.patch(`/categories/${id}/status`, { status });
  return response.data;
}

export async function deleteCategory(id) {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
}
