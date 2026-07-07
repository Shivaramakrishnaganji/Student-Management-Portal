import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    config.headers['user-id'] = userId;
  }
  return config;
});

// Auth
export const login = (loginId, password) => API.post('/auth', { loginId, password });
export const getMe = () => API.get('/auth/me');

// Students
export const getStudents = (params) => API.get('/students', { params });
export const createStudent = (data) => API.post('/students', data);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);

// Subjects
export const getSubjects = (params) => API.get('/subjects', { params });
export const createSubject = (data) => API.post('/subjects', data);

// Faculty Allocations
export const getAllocations = (params) => API.get('/faculty-allocations', { params });
export const getFacultyList = (params) => API.get('/faculty-allocations/list', { params });
export const createAllocation = (data) => API.post('/faculty-allocations', data);
export const updateAllocation = (id, data) => API.put(`/faculty-allocations/${id}`, data);
export const deleteAllocation = (id) => API.delete(`/faculty-allocations/${id}`);
export const createFaculty = (data) => API.post('/faculty-allocations/create', data);

// Attendance
export const markAttendance = (data) => API.post('/attendance', data);
export const getClassAttendance = (params) => API.get('/attendance/class', { params });
export const getStudentAttendance = (studentId, params) =>
  API.get(`/attendance/student/${studentId}`, { params });
export const getMyAttendance = () => API.get('/attendance/my-attendance');
export const getMyPercentage = () => API.get('/attendance/my-percentage');
export const getBunkersList = (params) => API.get('/attendance/bunkers', { params });

export default API;
