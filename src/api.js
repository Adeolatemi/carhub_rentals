const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function request(path, opts = {}) {
  const url = `${API_BASE}${path}`;
  const headers = opts.headers || {};
  if (localStorage.getItem("token")) headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
  const res = await fetch(url, { ...opts, headers: { "Content-Type": "application/json", ...headers } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}

// helper to POST FormData (multipart) without overriding Content-Type
async function postForm(path, formData, opts = {}){
  const url = `${API_BASE}${path}`
  const headers = opts.headers || {}
  if (localStorage.getItem("token")) headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`
  const res = await fetch(url, { method: opts.method || 'POST', body: formData, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw data
  return data
}

export const auth = {
  register: (payload) => request(`/auth/register`, { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => request(`/auth/login`, { method: "POST", body: JSON.stringify(payload) }),
  passwordReset: (payload) => request(`/auth/password-reset`, { method: "POST", body: JSON.stringify(payload) }),
};

export const vehicles = {
  list: (q) => request(`/vehicles?${new URLSearchParams(q || {}).toString()}`),
  get: (id) => request(`/vehicles/${id}`),
};

export const orders = {
  request: (payload) => request(`/orders/request`, { method: "POST", body: JSON.stringify(payload) }),
  requestForm: (formData) => postForm(`/orders/request`, formData),
  checkout: (orderId) => request(`/orders/checkout/${orderId}`, { method: "POST" }),
};

export const admin = {
  createAdmin: (payload) => request(`/admin/admins`, { method: "POST", body: JSON.stringify(payload) }),
  createPartner: (payload) => request(`/admin/partners`, { method: "POST", body: JSON.stringify(payload) }),
  toggleUserActive: (id, isActive) => request(`/admin/users/${id}/active`, { method: "PATCH", body: JSON.stringify({ isActive }) }),
  overview: () => request(`/admin/overview`),
  updateOrderStatus: (id, payload) => request(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify(payload) }),
  createVehicle: (payload) => request(`/vehicles`, { method: "POST", body: JSON.stringify(payload) }),
  delistVehicle: (id) => request(`/vehicles/${id}/delist`, { method: "PATCH" }),
};
