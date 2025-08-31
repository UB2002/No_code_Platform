import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Play, Trash2, Calendar } from 'lucide-react'
import WorkflowBuilder from './WorkflowBuilder'
import axios from 'axios'

const Dashboard = () => {
  const [workflows, setWorkflows] = useState([])
  const [loading, setLoading] = useState(true)
  const [showBuilder, setShowBuilder] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/workflows')
      setWorkflows(response.data)
    } catch (error) {
      console.error('Failed to fetch workflows:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteWorkflow = async (workflowId) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return

    try {
      await axios.delete(`http://localhost:8000/api/workflows/${workflowId}`)
      setWorkflows(workflows.filter(w => w.id !== workflowId))
    } catch (error) {
      alert('Failed to delete workflow: ' + (error.response?.data?.detail || error.message))
    }
  }

  const runWorkflow = (workflowId) => {
    navigate(`/workflow/${workflowId}`)
  }

  if (showBuilder) {
    return <WorkflowBuilder onBack={() => setShowBuilder(false)} />
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Workflows</h1>
        <button 
          onClick={() => setShowBuilder(true)} 
          className="btn btn-primary"
        >
          <Plus size={16} />
          Create New Workflow
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading workflows...</div>
      ) : (
        <div className="workflows-grid">
          {workflows.length === 0 ? (
            <div className="empty-state">
              <h3>No workflows yet</h3>
              <p>Create your first workflow to get started</p>
              <button 
                onClick={() => setShowBuilder(true)} 
                className="btn btn-primary"
              >
                <Plus size={16} />
                Create Workflow
              </button>
            </div>
          ) : (
            workflows.map((workflow) => (
              <div key={workflow.id} className="workflow-card">
                <div className="workflow-header">
                  <h3>{workflow.name}</h3>
                  <div className="workflow-actions">
                    <button 
                      onClick={() => runWorkflow(workflow.id)}
                      className="btn btn-sm btn-primary"
                      title="Run Workflow"
                    >
                      <Play size={14} />
                    </button>
                    <button 
                      onClick={() => deleteWorkflow(workflow.id)}
                      className="btn btn-sm btn-danger"
                      title="Delete Workflow"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <div className="workflow-info">
                  <div className="workflow-meta">
                    <span className="owner">Owner: {workflow.owner}</span>
                    <span className="created-date">
                      <Calendar size={12} />
                      {new Date(workflow.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="workflow-stats">
                    {workflow.definition && typeof workflow.definition === 'object' ? (
                      <>
                        <span>{workflow.definition.nodes?.length || 0} components</span>
                        <span>{workflow.definition.edges?.length || 0} connections</span>
                      </>
                    ) : (
                      <span>Legacy workflow</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Dashboard