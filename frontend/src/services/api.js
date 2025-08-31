import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Workflow API calls
export const workflowAPI = {
  getAll: () => api.get('/workflows'),
  
  save: (name, definition, owner) => 
    api.post('/save-workflow', { name, definition, owner }),
  
  runInline: (workflow, query) => 
    api.post('/run-workflow-inline', { workflow, query }),
  
  delete: (id) => api.delete(`/workflows/${id}`),
}

// Document API calls
export const documentAPI = {
  upload: (formData) => 
    api.post('/upload-doc', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
}

export default api