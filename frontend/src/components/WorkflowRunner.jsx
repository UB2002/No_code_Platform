import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Loader } from 'lucide-react'
import axios from 'axios'

const WorkflowRunner = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [workflow, setWorkflow] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [workflowLoading, setWorkflowLoading] = useState(true)

  useEffect(() => {
    fetchWorkflow()
  }, [id])

  const fetchWorkflow = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/workflows`)
      const workflows = response.data
      const currentWorkflow = workflows.find(w => w.id === parseInt(id))
      
      if (currentWorkflow) {
        setWorkflow(currentWorkflow)
      } else {
        alert('Workflow not found')
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Failed to fetch workflow:', error)
      alert('Failed to load workflow')
      navigate('/dashboard')
    } finally {
      setWorkflowLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || loading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    try {
      const response = await axios.post(`http://localhost:8000/api/run-workflow-inline`, {
        workflow: typeof workflow.definition === 'string' ? JSON.parse(workflow.definition) : workflow.definition,
        query: inputValue
      })

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.data.answer,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: 'Error: ' + (error.response?.data?.detail || error.message),
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (workflowLoading) {
    return <div className="loading">Loading workflow...</div>
  }

  if (!workflow) {
    return <div className="error">Workflow not found</div>
  }

  return (
    <div className="workflow-runner">
      <div className="runner-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
        <h1>{workflow.name}</h1>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="welcome-message">
              <h3>Welcome to {workflow.name}</h3>
              <p>Ask me anything and I'll process it through this workflow.</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-content">
                {message.content}
              </div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="message ai loading">
              <div className="message-content">
                <Loader size={16} className="spinner" />
                Processing your request...
              </div>
            </div>
          )}
        </div>

        <div className="chat-input">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows={2}
            disabled={loading}
          />
          <button 
            onClick={sendMessage} 
            disabled={!inputValue.trim() || loading}
            className="send-btn"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default WorkflowRunner