import axios from 'axios'

const API_BASE = 'http://localhost:8080/api'

export const createReport = (reportData) => {
  return axios.post(`${API_BASE}/reports`, reportData)
}

export const getAllReports = () => {
  return axios.get(`${API_BASE}/reports`, {
    headers: { 'Cache-Control': 'no-cache' },
    params: { _t: Date.now() }
  })
}

export const updateReportStatus = (id, status) => {
  const token = localStorage.getItem('token')
  return axios.put(`${API_BASE}/reports/${id}/status?status=${status}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  })
}

export const login = (email, password) => {
  return axios.post(`${API_BASE}/auth/login`, { email, password })
}

export const register = (userData) => {
  return axios.post(`${API_BASE}/auth/register`, userData)
}